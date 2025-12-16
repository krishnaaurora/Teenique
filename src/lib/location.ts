// Lightweight location helpers: get current coords and reverse-geocode via Google Geocoding API
export type Coords = { lat: number; lng: number };

export async function getCurrentCoords(options: PositionOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Geolocation not supported'));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      options
    );
  });
}

export async function reverseGeocode(lat: number, lng: number, apiKey?: string) {
  const key = apiKey || (import.meta.env && (import.meta.env.VITE_GOOGLE_API_KEY as string));
  if (!key) throw new Error('Google API key required (pass as argument or set VITE_GOOGLE_API_KEY)');

  // Prefer street_address results which are more likely to be a precise postal/street address.
  // Also we'll request results and then prefer any result whose geometry.location_type === 'ROOFTOP'.
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${encodeURIComponent(
    `${lat},${lng}`
  )}&result_type=street_address&key=${encodeURIComponent(key)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding request failed: ${res.status}`);
  const json = await res.json();

  // If we have results, try to find the most precise one (ROOFTOP). Otherwise fall back to first result.
  const results = Array.isArray(json?.results) ? json.results : [];
  if (results.length === 0) return json;

  const rooftop = results.find((r: any) => r?.geometry?.location_type === 'ROOFTOP');
  const chosen = rooftop || results[0];
  // return a compact envelope containing the chosen result and the full response for debugging
  return { chosen, results: json.results, status: json.status };
}

export async function getAddressFromCurrentLocation(apiKey?: string) {
  const { lat, lng } = await getCurrentCoords();
  const raw = await reverseGeocode(lat, lng, apiKey);
  // `reverseGeocode` now returns an object with `chosen` when Google key is used.
  const address = raw?.chosen?.formatted_address || raw?.results?.[0]?.formatted_address || null;
  return { lat, lng, address, raw };
}

export default {
  getCurrentCoords,
  reverseGeocode,
  getAddressFromCurrentLocation,
};
