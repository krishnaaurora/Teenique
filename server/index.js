import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const GEO_KEY = process.env.GEOAPIFY_API_KEY;
if (!GEO_KEY) {
  console.warn('Warning: GEOAPIFY_API_KEY not set in environment. Proxy endpoints will return 500.');
}

// Simple in-memory cache to reduce Geoapify requests. TTL in milliseconds.
const cache = new Map();
const DEFAULT_TTL = 1000 * 60 * 60; // 1 hour

function cacheKey(prefix, q) {
  return `${prefix}::${String(q)}`;
}

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function setCached(key, value, ttl = DEFAULT_TTL) {
  cache.set(key, { value, expires: Date.now() + ttl });
}

// Periodically purge expired entries
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of cache.entries()) {
    if (v.expires <= now) cache.delete(k);
  }
}, 1000 * 60 * 10);

// Simple per-IP rate limiter (fixed window)
const rateLimitMap = new Map();
const RATE_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_MAX = 60; // max requests per IP per window

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, remaining: RATE_MAX - 1, resetAt: Date.now() + RATE_WINDOW_MS };
  }
  if (entry.count >= RATE_MAX) return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return { allowed: true, remaining: RATE_MAX - entry.count, resetAt: entry.resetAt };
}

app.get('/api/geocode', async (req, res) => {
  const text = req.query.text;
  if (!text) return res.status(400).json({ error: 'missing text query' });
  if (!GEO_KEY) return res.status(500).json({ error: 'server missing GEOAPIFY_API_KEY' });
  const key = cacheKey('geocode', text);
  const cached = getCached(key);
  if (cached) return res.json(cached);
  try {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(String(text))}&apiKey=${encodeURIComponent(GEO_KEY)}`;
    const r = await fetch(url);
    const json = await r.json();
    setCached(key, json);
    return res.json(json);
  } catch (e) {
    console.error('geocode proxy error', e);
    return res.status(502).json({ error: 'geocode proxy failed', detail: String(e) });
  }
});

app.get('/api/reverse', async (req, res) => {
  const lat = req.query.lat;
  const lng = req.query.lng;
  if (!lat || !lng) return res.status(400).json({ error: 'missing lat/lng' });
  if (!GEO_KEY) return res.status(500).json({ error: 'server missing GEOAPIFY_API_KEY' });
  const key = cacheKey('reverse', `${lat},${lng}`);
  const cached = getCached(key);
  if (cached) return res.json(cached);
  try {
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lng))}&apiKey=${encodeURIComponent(GEO_KEY)}`;
    const r = await fetch(url);
    const json = await r.json();
    setCached(key, json);
    return res.json(json);
  } catch (e) {
    console.error('reverse proxy error', e);
    return res.status(502).json({ error: 'reverse proxy failed', detail: String(e) });
  }
});

// Google Geocoding proxy endpoints (server-side key required)
const GOOGLE_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_KEY) {
  console.warn('Warning: GOOGLE_API_KEY not set. /api/google/* endpoints will return 500 until configured.');
}

app.get('/api/google/reverse', async (req, res) => {
  const lat = req.query.lat;
  const lng = req.query.lng;
  if (!lat || !lng) return res.status(400).json({ error: 'missing lat/lng' });
  if (!GOOGLE_KEY) return res.status(500).json({ error: 'server missing GOOGLE_API_KEY' });
  // rate limit per IP
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const rl = checkRateLimit(String(ip));
  res.setHeader('X-RateLimit-Remaining', String(rl.remaining));
  res.setHeader('X-RateLimit-Reset', String(Math.ceil((rl.resetAt - Date.now()) / 1000)));
  if (!rl.allowed) return res.status(429).json({ error: 'rate limit exceeded' });

  // cached responses
  const key = cacheKey('google:reverse', `${lat},${lng}`);
  const cached = getCached(key);
  if (cached) return res.json(cached);
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${encodeURIComponent(String(lat))},${encodeURIComponent(String(lng))}&result_type=street_address&key=${encodeURIComponent(GOOGLE_KEY)}`;
    const r = await fetch(url);
    const json = await r.json();
    // prefer ROOFTOP
    const results = Array.isArray(json.results) ? json.results : [];
    const rooftop = results.find((r) => r?.geometry?.location_type === 'ROOFTOP');
    const chosen = rooftop || results[0] || null;
    const out = { chosen, results: json.results, status: json.status };
    setCached(key, out, DEFAULT_TTL);
    return res.json(out);
  } catch (e) {
    console.error('google reverse proxy error', e);
    return res.status(502).json({ error: 'google reverse proxy failed', detail: String(e) });
  }
});

app.get('/api/google/geocode', async (req, res) => {
  const text = req.query.text;
  if (!text) return res.status(400).json({ error: 'missing text query' });
  if (!GOOGLE_KEY) return res.status(500).json({ error: 'server missing GOOGLE_API_KEY' });
  // rate limit per IP
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const rl = checkRateLimit(String(ip));
  res.setHeader('X-RateLimit-Remaining', String(rl.remaining));
  res.setHeader('X-RateLimit-Reset', String(Math.ceil((rl.resetAt - Date.now()) / 1000)));
  if (!rl.allowed) return res.status(429).json({ error: 'rate limit exceeded' });

  const key = cacheKey('google:geocode', String(text));
  const cached = getCached(key);
  if (cached) return res.json(cached);
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(String(text))}&key=${encodeURIComponent(GOOGLE_KEY)}`;
    const r = await fetch(url);
    const json = await r.json();
    setCached(key, json, DEFAULT_TTL);
    return res.json(json);
  } catch (e) {
    console.error('google geocode proxy error', e);
    return res.status(502).json({ error: 'google geocode proxy failed', detail: String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`Geo proxy listening on port ${PORT}`);
});
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const GEO_KEY = process.env.GEOAPIFY_API_KEY;

if (!GEO_KEY) {
  console.warn('Warning: GEOAPIFY_API_KEY not set. /api/geocode will return 500 until configured.');
}

app.get('/api/geocode', async (req, res) => {
  const text = req.query.text;
  if (!text) return res.status(400).json({ error: 'missing text query param' });
  if (!GEO_KEY) return res.status(500).json({ error: 'server misconfigured: GEOAPIFY_API_KEY missing' });

  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(String(text))}&apiKey=${encodeURIComponent(GEO_KEY)}`;
  try {
    const r = await fetch(url);
    const json = await r.json();
    return res.json(json);
  } catch (err) {
    return res.status(502).json({ error: 'geocode failed', detail: String(err) });
  }
});

app.get('/api/reverse', async (req, res) => {
  const lat = req.query.lat;
  const lng = req.query.lng;
  if (!lat || !lng) return res.status(400).json({ error: 'missing lat or lng' });
  if (!GEO_KEY) return res.status(500).json({ error: 'server misconfigured: GEOAPIFY_API_KEY missing' });

  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lng))}&apiKey=${encodeURIComponent(GEO_KEY)}`;
  try {
    const r = await fetch(url);
    const json = await r.json();
    return res.json(json);
  } catch (err) {
    return res.status(502).json({ error: 'reverse geocode failed', detail: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Geocode proxy running on http://localhost:${PORT}`);
});
