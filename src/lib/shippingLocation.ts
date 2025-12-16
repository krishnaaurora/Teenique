// Helpers for browser geolocation, Google Geocoding and Places APIs
export type Coords = { lat: number; lng: number };

const GOOGLE_KEY = (import.meta.env as any).VITE_GOOGLE_API_KEY as string | undefined;

export async function getCurrentCoords(options: PositionOptions | any = { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }): Promise<{ lat: number; lng: number; accuracy: number }> {
  if (!navigator.geolocation) throw new Error('Geolocation not supported');

  // Try to gather a few samples with watchPosition and pick the most accurate one.
  // This helps on devices where the first fix is coarse (e.g., desktop WiFi or weak GPS).
  const desiredAccuracy = typeof options.desiredAccuracy === 'number' ? options.desiredAccuracy : 30; // meters
  const overallTimeout = typeof options.timeout === 'number' ? options.timeout : 20000;

  return new Promise((resolve, reject) => {
    let best: GeolocationPosition | null = null;
    let settled = false;

    const onSuccess = (pos: GeolocationPosition) => {
      // keep the most accurate reading
      if (!best || pos.coords.accuracy < best.coords.accuracy) best = pos;

      // if we reached desired accuracy, resolve immediately
      if (pos.coords.accuracy <= desiredAccuracy && !settled) {
        settled = true;
        navigator.geolocation.clearWatch(watchId);
        clearTimeout(timer);
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
      }
    };

    const onError = (err: GeolocationPositionError) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        navigator.geolocation.clearWatch(watchId);
        reject(err);
      }
    };

    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: !!options.enableHighAccuracy,
      maximumAge: typeof options.maximumAge === 'number' ? options.maximumAge : 0,
      // timeout is ignored by watchPosition but keep for compatibility
      timeout: typeof options.timeout === 'number' ? options.timeout : undefined,
    } as PositionOptions);

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      navigator.geolocation.clearWatch(watchId);
      if (best) {
        resolve({ lat: best.coords.latitude, lng: best.coords.longitude, accuracy: best.coords.accuracy });
      } else {
        reject(new Error('Timeout obtaining position'));
      }
    }, overallTimeout);
  });
}

export async function reverseGeocode(lat: number, lng: number, apiKey?: string) {
  const key = apiKey || GOOGLE_KEY;
  // If we have a client-side Google key, use Google Geocode as before
  if (key) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${encodeURIComponent(`${lat},${lng}`)}&result_type=street_address&key=${encodeURIComponent(key)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocode failed: ${res.status}`);
    const json = await res.json();
    const results = Array.isArray(json.results) ? json.results : [];
    if (results.length === 0) return { raw: json };

    const rooftop = results.find((r: any) => r?.geometry?.location_type === 'ROOFTOP');
    const chosen = rooftop || results[0];
    const compMap: Record<string, string> = {};
    (chosen.address_components || []).forEach((c: any) => {
      (c.types || []).forEach((t: string) => (compMap[t] = c.long_name));
    });
    return { chosen, compMap, raw: json };
  }

  // No client key — try server-side proxy at /api/reverse (expects server to have Geoapify key)
  try {
    const proxyRes = await fetch(`/api/reverse?lat=${encodeURIComponent(String(lat))}&lng=${encodeURIComponent(String(lng))}`);
    if (!proxyRes.ok) throw new Error(`Proxy reverse geocode failed: ${proxyRes.status}`);
    const json = await proxyRes.json();
    // Geoapify reverse returns { features: [...] }
    const feat = Array.isArray(json.features) && json.features[0];
    if (!feat) return { raw: json };
    const prop = feat.properties || {};
    const chosen: any = {
      formatted_address: prop.formatted || prop.formatted || prop.county || '',
      geometry: { location: { lat: feat?.geometry?.coordinates?.[1], lng: feat?.geometry?.coordinates?.[0] } },
    };
    const compMap: Record<string, string> = {};
    if (prop.street) compMap['route'] = prop.street;
    if (prop.housenumber) compMap['street_number'] = prop.housenumber;
    if (prop.city) compMap['locality'] = prop.city;
    if (prop.postcode) compMap['postal_code'] = prop.postcode;
    if (prop.state) compMap['administrative_area_level_1'] = prop.state;
    return { chosen, compMap, raw: json };
  } catch (e) {
    return { raw: { error: String(e) } };
  }
}

export async function geocodeText(text: string) {
  // Prefer server-side proxy to keep API keys off the client.
  try {
    const resp = await fetch(`/api/geocode?text=${encodeURIComponent(text)}`);
    if (!resp.ok) throw new Error(`Proxy geocode failed: ${resp.status}`);
    const json = await resp.json();
    // Geoapify returns features array
    const feat = Array.isArray(json.features) && json.features[0];
    if (!feat) return { raw: json };
    const prop = feat.properties || {};
    return { raw: json, feature: feat, properties: prop };
  } catch (e) {
    return { raw: { error: String(e) } };
  }
}

export async function nearbyPlaces(lat: number, lng: number, radius = 100, apiKey?: string) {
  const key = apiKey || GOOGLE_KEY;
  if (!key) throw new Error('Google API key required (set VITE_GOOGLE_API_KEY)');
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${encodeURIComponent(`${lat},${lng}`)}&radius=${encodeURIComponent(String(radius))}&key=${encodeURIComponent(key)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Places nearby failed: ${res.status}`);
  const json = await res.json();
  // If nearby search returns no results, try a Text Search fallback centered on coordinates
  const results = Array.isArray(json.results) ? json.results : [];
  if (results.length > 0) return json;

  // Build a loose query for Text Search using lat/lng as location_hint
  const textUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=landmark|building|establishment&location=${encodeURIComponent(
    `${lat},${lng}`
  )}&radius=${encodeURIComponent(String(radius * 3))}&key=${encodeURIComponent(key)}`;
  try {
    const tres = await fetch(textUrl);
    if (!tres.ok) return json;
    const tjson = await tres.json();
    return tjson;
  } catch (e) {
    return json;
  }
}

export async function getPlaceDetails(placeId: string, apiKey?: string) {
  const key = apiKey || GOOGLE_KEY;
  if (!key) throw new Error('Google API key required (set VITE_GOOGLE_API_KEY)');
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,formatted_address,geometry,address_component,formatted_phone_number,website&key=${encodeURIComponent(key)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Place details failed: ${res.status}`);
  const json = await res.json();
  return json;
}

export default {
  getCurrentCoords,
  reverseGeocode,
  nearbyPlaces,
  getPlaceDetails,
  geocodeText,
};
