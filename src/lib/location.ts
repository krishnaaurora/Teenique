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

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${encodeURIComponent(
    `${lat},${lng}`
  )}&key=${encodeURIComponent(key)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding request failed: ${res.status}`);
  const json = await res.json();
  return json;
}

export async function getAddressFromCurrentLocation(apiKey?: string) {
  const { lat, lng } = await getCurrentCoords();
  const raw = await reverseGeocode(lat, lng, apiKey);
  const address = raw?.results?.[0]?.formatted_address;
  return { lat, lng, address, raw };
}

export default {
  getCurrentCoords,
  reverseGeocode,
  getAddressFromCurrentLocation,
};
