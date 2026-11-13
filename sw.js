// Travel Weather Explorer Service Worker
// Provides offline caching for static assets and API responses

const CACHE_NAME = 'tw-explorer-v3';
const STATIC_CACHE = 'tw-static-v3';
const DATA_CACHE = 'tw-data-v3';

// Assets to cache immediately
const STATIC_ASSETS = [
  './',
  './travel-weather-explorer.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/topojson@3',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS.map(url => {
        // Handle OpenStreetMap tile URLs with wildcards
        if (url.includes('{s}')) return Promise.resolve();
        return new Request(url, { credentials: 'omit' });
      }).filter(Boolean));
    }).catch(err => console.log('[SW] Static cache failed:', err))
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== STATIC_CACHE && key !== DATA_CACHE && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http(s) schemes
  if (!url.protocol.startsWith('http')) return;
  
  // Handle different resource types
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isDataRequest(url)) {
    event.respondWith(staleWhileRevalidate(request, DATA_CACHE));
  } else if (isTileRequest(url)) {
    event.respondWith(cacheFirst(request, DATA_CACHE));
  } else {
    event.respondWith(networkFirst(request, CACHE_NAME));
  }
});

// Check if request is for a static asset
function isStaticAsset(url) {
  return url.origin === location.origin ||
    url.hostname === 'cdn.jsdelivr.net' ||
    url.hostname === 'unpkg.com';
}

// Check if request is for data (API, GeoJSON)
function isDataRequest(url) {
  return url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('world-atlas');
}

// Check if request is for map tiles
function isTileRequest(url) {
  return url.hostname.includes('tile.openstreetmap.org');
}

// Cache-first strategy (for static assets)
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    console.log('[SW] Fetch failed:', err);
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy (for dynamic content)
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

// Stale-while-revalidate (for data that can be slightly stale)
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => cached);
  
  return cached || fetchPromise;
}

// Handle messages from main thread
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
  if (event.data === 'clearCache') {
    caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
  }
});