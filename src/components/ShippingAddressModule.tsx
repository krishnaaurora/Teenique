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
  const [loadingLocation, setLoadingLocation] = useState(false);

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
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&addressdetails=1`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) {
        const txt = await res.text().catch(() => res.statusText || String(res.status));
        throw new Error('Nominatim response error: ' + txt);
      }
      const data = await res.json();
      const addr = data && data.address ? data.address : null;
      if (!addr) {
        setError('No address found for this location');
        return;
      }

      const route = addr.road || addr.pedestrian || addr.cycleway || addr.footway || addr.path || null;
      const postal = addr.postcode || null;
      const locality = addr.city || addr.town || addr.village || addr.hamlet || null;
      const admin = addr.state || addr.county || null;

      if (route) setField('street', route);
      if (locality) setField('city', locality);
      if (admin) setField('state', admin);
      if (postal) setField('zip', postal);

      setError(null);
    } catch (e: any) {
      console.error('reverseGeocodeAndFill error', e);
      setError('Reverse geocode failed: ' + (e?.message || e));
    }
  };

  // IP-based approximate location fallback (ipapi.co)
  const ipFallback = async () => {
    try {
      setStatus('Using approximate location (IP)');
      const r = await fetch('https://ipapi.co/json/');
      if (!r.ok) throw new Error('IP lookup failed: ' + r.status);
      const j = await r.json();
      const lat = Number(j.latitude || j.lat || j.latitude);
      const lon = Number(j.longitude || j.lon || j.longitude);
      if (!lat || !lon) throw new Error('IP lookup did not return coordinates');
      await reverseGeocodeAndFill(lat, lon);
      await initMap(lat, lon);
      setStatus('Approximate location applied');
      return true;
    } catch (e: any) {
      console.warn('ipFallback failed', e);
      setError('IP-based location fallback failed: ' + (e?.message || e));
      return false;
    } finally {
      setLoadingLocation(false);
    }
  };

  // Initialize Leaflet map and draggable marker
  const initMap = async (lat: number, lng: number) => {
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
          await reverseGeocodeAndFill(pos.lat, pos.lng);
        });
      } else {
        markerRef.current.setLatLng([lat, lng]);
        markerRef.current.addTo(leafletMap.current);
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

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      // Low accuracy warning threshold (meters)
      const LOW_ACCURACY_THRESHOLD = 100;
      if (accuracy && accuracy > LOW_ACCURACY_THRESHOLD) {
        setError(`Location accuracy is low (${Math.round(accuracy)}m). Results may be imprecise.`);
      }

      try {
        await reverseGeocodeAndFill(latitude, longitude);
        await initMap(latitude, longitude);
        setStatus('Location applied');
      } catch (e: any) {
        setError('Failed to apply location: ' + (e?.message || e));
      } finally {
        setLoadingLocation(false);
      }
    }, (err) => {
      // Handle geolocation errors with clearer messages
      const code = err && err.code;
      if (code === 1) {
        setError('Permission denied for location access');
      } else if (code === 2) {
        setError('Position unavailable — trying approximate IP lookup...');
        // try IP fallback
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
    }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
  };

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
    };
    try {
      if (onSave) await onSave(payload);
      else await fetch('/api/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setStatus('Saved');
    } catch (e: any) {
      setError('Save failed: ' + (e?.message || e));
    }
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
          <select value={form.addressType} onChange={(e) => setField('addressType', e.target.value)} className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#D9C6A4] focus:border-[#D9C6A4] mt-1 bg-white">
            <option>Home</option>
            <option>Work</option>
            <option>Other</option>
          </select>
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
