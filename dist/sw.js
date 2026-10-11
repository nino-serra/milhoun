const CACHE_VERSION = 'v2';
const CACHE_PREFIX = `milhoun-shell-${encodeURIComponent(self.registration.scope)}-`;
const CACHE = CACHE_PREFIX + CACHE_VERSION;
const FILES = [
  './', './index.html', './style.css', './favicon.svg', './manifest.webmanifest',
  './icon-192.svg', './icon-512.svg', './pwa.js', './game.js', './abilities.js', './ability-world.js',
  './building.js', './camp-clearance.js', './camp-life.js', './companions.js', './dinosaurs.js',
  './ecology.js', './encounters.js', './expedition-view.js', './expeditions.js', './exploration.js',
  './expressions.js', './fire-puzzle.js', './frontier-scenery.js', './frontier.js', './island.js',
  './journey-models.js', './journey-world.js', './journey.js', './marine.js', './milo.js',
  './outfits.js', './player-model.js', './player.js', './raptor-habitat.js', './resources.js',
  './save-transfer.js', './shop-building.js', './shop-view.js', './shop.js', './sound.js',
  './unified-store.js', './weather.js', './vendor/three.module.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;
  event.respondWith(fetch(request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
    }
    return response;
  }).catch(async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') return caches.match('./index.html');
    return Response.error();
  }));
});
