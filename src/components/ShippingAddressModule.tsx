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
  const googleMap = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);

  // Replace with your API key (user provided). Keep key usage secure on your backend if needed.
  const GOOGLE_API_KEY = 'AIzaSyBr4tKPMTXo88v3e_gYEMHZxm4wroUa2XI';

  // Load Google Maps JS API dynamically
  const loadGoogleMaps = (): Promise<void> => {
    if ((window as any).google && (window as any).google.maps) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-src="google-maps"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Google Maps failed to load')));
        return;
      }
      const s = document.createElement('script');
      s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`;
      s.async = true;
      s.defer = true;
      s.setAttribute('data-src', 'google-maps');
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Google Maps script failed to load'));
      document.head.appendChild(s);
    });
  };

  // Reverse geocode lat/lng and update the form fields (street: route only, city, state, postal_code)
  const reverseGeocodeAndFill = async (lat: number, lng: number) => {
    try {
      await loadGoogleMaps();
      if (!geocoderRef.current) geocoderRef.current = new (window as any).google.maps.Geocoder();
      const results = await new Promise<any>((resolve, reject) => {
        geocoderRef.current.geocode({ location: { lat, lng } }, (res: any, status: any) => {
          if (status === 'OK') resolve(res);
          else reject(new Error('Geocoder failed: ' + status));
        });
      });

      const first = results && results[0];
      if (!first) {
        setError('No address found for this location');
        return;
      }

      // Parse components
      const comp = (type: string) => {
        const c = first.address_components.find((ac: any) => ac.types.includes(type));
        return c ? c.long_name : null;
      };

      const route = comp('route'); // street name
      const postal = comp('postal_code');
      const locality = comp('locality') || comp('sublocality') || comp('administrative_area_level_2');
      const admin = comp('administrative_area_level_1');

      // Update only the allowed fields
      if (route) setField('street', route);
      if (locality) setField('city', locality);
      if (admin) setField('state', admin);
      if (postal) setField('zip', postal);

      // clear any previous error
      setError(null);
    } catch (e: any) {
      setError('Reverse geocode failed: ' + (e?.message || e));
    }
  };

  // Initialize map and marker at given position
  const initMap = async (lat: number, lng: number) => {
    await loadGoogleMaps();
    const google = (window as any).google;
    if (!mapRef.current) return;

    if (!googleMap.current) {
      googleMap.current = new google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 16,
        disableDefaultUI: true,
      });
    } else {
      googleMap.current.setCenter({ lat, lng });
    }

    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker({
        position: { lat, lng },
        map: googleMap.current,
        draggable: true,
      });
      markerRef.current.addListener('dragend', async (ev: any) => {
        const pos = markerRef.current.getPosition();
        const nla = pos.lat();
        const nlo = pos.lng();
        // update form by reverse geocoding new marker position
        await reverseGeocodeAndFill(nla, nlo);
      });
    } else {
      markerRef.current.setPosition({ lat, lng });
      markerRef.current.setMap(googleMap.current);
    }
  };

  // Use browser geolocation and populate fields/map
  const handleUseCurrentLocation = () => {
    setStatus('Fetching current location...');
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation not supported in this browser');
      setStatus(null);
      return;
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
      }
    }, (err) => {
      // Handle geolocation errors
      if (err.code === err.PERMISSION_DENIED) setError('Permission denied for location access');
      else setError('Geolocation error: ' + err.message);
      setStatus(null);
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
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
      {error && <div className="text-sm text-red-600 mb-2 font-medium">{error}</div>}

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
        <button onClick={handleUseCurrentLocation} className="px-4 py-2 rounded-xl bg-[#D9C6A4] text-[#0F0F0F] font-semibold shadow hover:brightness-95 transition-all">Use Current Location</button>
        <button onClick={save} className="px-6 py-2 rounded-xl bg-[#0F0F0F] text-white font-semibold shadow hover:bg-[#222] transition-all">Save Address</button>
        <button onClick={() => { setForm({ street: '', flat: '', landmark: '', city: '', state: '', zip: '', country: 'India', addressType: 'Home', deliveryInstructions: '', setAsDefault: false }); }} className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50">Clear</button>
      </div>

      {/* Map placeholder - rendered after location is loaded */}
      <div ref={mapRef} id="shipping-map" className="w-full h-64 mt-6 rounded-lg overflow-hidden" />
    </div>
  );
}
