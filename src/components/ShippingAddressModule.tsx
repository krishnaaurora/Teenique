import React, { useCallback, useState, useEffect, useRef } from 'react';

type Props = {
  onSave?: (payload: any) => Promise<any> | void;
};

export default function ShippingAddressModule({ onSave }: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    street: '',
    flat: '',
    landmark: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    addressType: 'Home',
    deliveryInstructions: '',
    setAsDefault: false,
  });

  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number } | null>(null);

  // Load Leaflet (CSS + JS) dynamically
  const loadLeaflet = (): Promise<void> => {
    if ((window as any).L) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const cssId = 'leaflet-css';
      if (!document.getElementById(cssId)) {
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      const existing = document.querySelector(`script[data-src="leaflet-js"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Leaflet failed to load')));
        return;
      }
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.async = true;
      s.defer = true;
      s.setAttribute('data-src', 'leaflet-js');
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Leaflet script failed to load'));
      document.head.appendChild(s);
    });
  };

  // Reverse geocode using Nominatim (OpenStreetMap)
  const reverseGeocodeAndFill = async (lat: number, lng: number) => {
    // Network geocoding is disabled per user preference — only browser geolocation is used.
    // Do not perform any external network calls. Leave address fields for manual entry.
    setStatus('Reverse geocoding disabled — coordinates available below');
    return;
  };

  // IP-based approximate location fallback (ipapi.co)
  // IP fallback removed to avoid external network calls per user request.
  const ipFallback = async () => {
    setError('IP-based fallback disabled');
    setLoadingLocation(false);
    return false;
  };

  // Initialize Leaflet map and draggable marker
  const initMap = async (lat: number, lng: number, accuracy?: number) => {
    try {
      await loadLeaflet();
      const L = (window as any).L;
      if (!mapRef.current) return;

      if (!leafletMap.current) {
        leafletMap.current = L.map(mapRef.current).setView([lat, lng], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(leafletMap.current);
      } else {
        leafletMap.current.setView([lat, lng], 16);
      }

      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(leafletMap.current);
        markerRef.current.on('dragend', async (ev: any) => {
          const pos = markerRef.current.getLatLng();
          setCurrentPos({ lat: pos.lat, lng: pos.lng });
          if (circleRef.current) circleRef.current.setLatLng([pos.lat, pos.lng]);
          // Reverse geocoding disabled — do not call external services.
        });
        setCurrentPos({ lat, lng });
      } else {
        markerRef.current.setLatLng([lat, lng]);
        markerRef.current.addTo(leafletMap.current);
        setCurrentPos({ lat, lng });
      }

      // show accuracy circle if available
      if (typeof accuracy === 'number' && !isNaN(accuracy)) {
        if (!circleRef.current) {
          circleRef.current = L.circle([lat, lng], { radius: Math.max(5, accuracy), color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.08 }).addTo(leafletMap.current);
        } else {
          circleRef.current.setLatLng([lat, lng]);
          circleRef.current.setRadius(Math.max(5, accuracy));
        }
      }
    } catch (e: any) {
      setError('Map init failed: ' + (e?.message || e));
    }
  };

  // Use browser geolocation and populate fields/map
  const handleUseCurrentLocation = () => {
    setLoadingLocation(true);
    setStatus('Fetching current location...');
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation not supported in this browser');
      setStatus(null);
      setLoadingLocation(false);
      return;
    }

    // Check Permissions API early (if available) to provide immediate feedback
    try {
      if ((navigator as any).permissions && (navigator as any).permissions.query) {
        (navigator as any).permissions.query({ name: 'geolocation' }).then((permStatus: any) => {
          if (permStatus.state === 'denied') {
            setError('Location permission is blocked — enable location for this site in your browser settings');
            setStatus(null);
            setLoadingLocation(false);
            return;
          }
        }).catch(() => {
          // ignore permission check errors
        });
      }
    } catch (e) {
      // ignore
    }

    // Try to improve accuracy via watchPosition: keep watching until accuracy is acceptable or timeout
    const LOW_ACCURACY_THRESHOLD = 50; // meters
    const MAX_WATCH_TIME = 20000; // ms
    let watchId: number | null = null;
    const start = Date.now();

    const success = async (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords as GeolocationCoordinates;

      try {
        // Do NOT perform reverse geocoding — only use coordinates per user request.
        await initMap(latitude, longitude, accuracy ?? undefined);
        setCurrentPos({ lat: latitude, lng: longitude });
        setStatus('Coordinates captured — complete address manually');
      } catch (e: any) {
        console.warn('apply location failed', e);
      }

      // If accuracy good enough, stop watching
      if (accuracy && accuracy <= LOW_ACCURACY_THRESHOLD) {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        setLoadingLocation(false);
        return;
      }

      // stop watching if we've exceeded max time
      if (Date.now() - start > MAX_WATCH_TIME) {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        if (accuracy) setError(`Location accuracy is low (${Math.round(accuracy)}m). Using best available coordinates.`);
        setLoadingLocation(false);
        return;
      }
      // otherwise, continue watching for better accuracy
    };

    const failure = (err: GeolocationPositionError) => {
      const code = err && err.code;
      if (code === 1) {
        setError('Permission denied for location access');
      } else if (code === 2) {
        setError('Position unavailable — trying approximate IP lookup...');
        ipFallback();
        return;
      } else if (code === 3) {
        setError('Location fetch timed out. Trying approximate IP lookup...');
        ipFallback();
        return;
      } else {
        setError('Geolocation error: ' + (err?.message || 'Unknown error'));
      }
      setStatus(null);
      setLoadingLocation(false);
    };

    try {
      watchId = navigator.geolocation.watchPosition(success, failure, { enableHighAccuracy: true, maximumAge: 0, timeout: MAX_WATCH_TIME });
      // also attempt a quick single-shot first (some browsers respond faster)
      navigator.geolocation.getCurrentPosition(success, failure, { enableHighAccuracy: true, maximumAge: 0, timeout: 8000 });
    } catch (e) {
      setError('Geolocation failed to start: ' + (e as any)?.message || e);
      setLoadingLocation(false);
    }
  };

  // (Sharing is handled by Checkout page; shipping module only supplies lat/lng in save payload)

  const setField = (k: string, v: any) => setForm((s) => ({ ...s, [k]: v }));

  

  

  const save = async () => {
    const payload = {
      street: form.street,
      flat: form.flat,
      landmark: form.landmark,
      city: form.city,
      state: form.state,
      zip: form.zip,
      country: form.country,
      addressType: form.addressType,
      deliveryInstructions: form.deliveryInstructions,
      setAsDefault: form.setAsDefault,
      lat: currentPos?.lat ?? null,
      lng: currentPos?.lng ?? null,
    };
    try {
      if (onSave) await onSave(payload);
      else await fetch('/api/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setStatus('Saved');
    } catch (e: any) {
      setError('Save failed: ' + (e?.message || e));
    }
  };

  const copyCoords = () => {
    if (!currentPos) return;
    const txt = `${currentPos.lat},${currentPos.lng}`;
    navigator.clipboard?.writeText(txt).then(() => setStatus('Coordinates copied to clipboard')).catch(() => setError('Failed to copy'));
  };

  return (
    <div className="bg-gradient-to-br from-[#f8f6f2] to-[#f3ede3] rounded-3xl p-8 border shadow-lg max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span className="inline-block bg-[#D9C6A4] text-[#0F0F0F] rounded-full p-2 mr-2">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#0F0F0F" strokeWidth="2" d="M12 21c-4.418 0-8-4.03-8-9a8 8 0 1 1 16 0c0 4.97-3.582 9-8 9Zm0-7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>
        </span>
        Shipping Address
      </h3>
      {status && <div className="text-sm text-emerald-700 mb-2 font-medium">{status}</div>}
      {error && (
        <div className="flex items-center gap-3 mb-2">
          <div className="text-sm text-red-600 font-medium">{error}</div>
          {!loadingLocation && (
            <button onClick={handleUseCurrentLocation} className="text-sm px-3 py-1 bg-white border rounded text-[#0F0F0F]">Retry</button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
        <div>
          <label className="block text-sm font-medium mb-1">Street Address</label>
          <input id="street" value={form.street} onChange={(e) => setField('street', e.target.value)} className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#D9C6A4] focus:border-[#D9C6A4] mt-1 bg-white" placeholder="123 Main St" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Flat / Floor <span className="text-xs text-gray-400">(manual)</span></label>
          <input id="flat" value={form.flat} onChange={(e) => setField('flat', e.target.value)} className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#D9C6A4] focus:border-[#D9C6A4] mt-1 bg-white" placeholder="Apt, Suite, etc." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Landmark</label>
          <input id="landmark" value={form.landmark} onChange={(e) => setField('landmark', e.target.value)} className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#D9C6A4] focus:border-[#D9C6A4] mt-1 bg-white" placeholder="Near park, mall, etc." />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="text-sm text-[#0F0F0F]/80">
          <div className="font-medium">Coordinates</div>
          <div className="text-xs text-[#6B6B6B]">{currentPos ? `${currentPos.lat.toFixed(6)}, ${currentPos.lng.toFixed(6)}` : 'No coordinates captured'}</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copyCoords} disabled={!currentPos} className="px-3 py-2 rounded-lg bg-[#F5F5F5] border text-sm">Copy</button>
          {currentPos && (
            <a href={`https://www.openstreetmap.org/?mlat=${currentPos.lat}&mlon=${currentPos.lng}#map=18/${currentPos.lat}/${currentPos.lng}`} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg bg-[#D9C6A4] text-black font-medium">Open Map</a>
          )}
        </div>
      </div>

      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="text-sm font-medium mb-1">City</label>
          <input id="city" value={form.city} onChange={(e) => setField('city', e.target.value)} className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#D9C6A4] focus:border-[#D9C6A4] mt-1 bg-white" placeholder="City" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1">State</label>
          <input id="state" value={form.state} onChange={(e) => setField('state', e.target.value)} className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#D9C6A4] focus:border-[#D9C6A4] mt-1 bg-white" placeholder="State" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1">ZIP Code</label>
          <input id="zip" value={form.zip} onChange={(e) => setField('zip', e.target.value)} className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#D9C6A4] focus:border-[#D9C6A4] mt-1 bg-white" placeholder="Postal Code" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1">Address Type</label>
          <div className="flex gap-2 mt-1">
            {[
              { label: 'Home', icon: '🏠' },
              { label: 'Work', icon: '🏢' },
              { label: 'Other', icon: '📍' },
            ].map((type) => (
              <button
                key={type.label}
                type="button"
                onClick={() => setField('addressType', type.label)}
                className={`flex items-center gap-1 px-4 py-2 rounded-full border font-medium transition-all text-sm
                  ${form.addressType === type.label ? 'bg-[#D9C6A4] text-[#0F0F0F] border-[#D9C6A4] shadow' : 'bg-white text-[#6B6B6B] border-[#E8E4DE] hover:bg-[#f5f3ef]'}
                `}
                aria-pressed={form.addressType === type.label}
              >
                <span className="text-lg">{type.icon}</span> {type.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1">Delivery Instructions</label>
          <textarea value={form.deliveryInstructions} onChange={(e) => setField('deliveryInstructions', e.target.value)} className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#D9C6A4] focus:border-[#D9C6A4] mt-1 bg-white h-20" placeholder="e.g. Call on arrival, leave at door..." />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <input id="setDefault" type="checkbox" checked={form.setAsDefault} onChange={(e) => setField('setAsDefault', e.target.checked)} className="accent-[#D9C6A4] w-4 h-4" />
        <label htmlFor="setDefault" className="text-sm">Set as Default</label>
      </div>

      

      <div className="mt-6 flex gap-3">
        <button onClick={handleUseCurrentLocation} disabled={loadingLocation} className={`px-4 py-2 rounded-xl text-[#0F0F0F] font-semibold shadow hover:brightness-95 transition-all ${loadingLocation ? 'bg-[#d7d1b8] cursor-wait' : 'bg-[#D9C6A4]'}`}>
          {loadingLocation ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
              Locating...
            </span>
          ) : 'Use Current Location'}
        </button>
        <button onClick={save} className="px-6 py-2 rounded-xl bg-[#0F0F0F] text-white font-semibold shadow hover:bg-[#222] transition-all">Save Address</button>
        <button onClick={() => { setForm({ street: '', flat: '', landmark: '', city: '', state: '', zip: '', country: 'India', addressType: 'Home', deliveryInstructions: '', setAsDefault: false }); }} className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50">Clear</button>
      </div>

      {/* Map placeholder - rendered after location is loaded */}
      <div className="w-full h-64 mt-6 rounded-lg overflow-hidden relative">
        <div ref={mapRef} id="shipping-map" className="w-full h-full" />
        {loadingLocation && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <div className="flex items-center gap-3 bg-white/90 p-3 rounded shadow">
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
              <span className="text-sm font-medium">Fetching location…</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
