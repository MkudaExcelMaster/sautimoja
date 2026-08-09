const CACHE_NAME = "sautimoja-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./script.js",
  "./style.css",
  "./manifest.json"
];

// 1. INSTALL EVENT: Inahifadhi files kwenye cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching assets...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. ACTIVATE EVENT: Inafuta cache za zamani ikiwa umebadilisha toleo
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Service Worker: Deleting old cache...", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. FETCH EVENT: Inaleta data kutoka cache ikikosa intaneti
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
