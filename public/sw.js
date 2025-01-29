// Service Worker for image caching
const CACHE_NAME = 'piccom-image-cache-v1';
const IMAGE_CACHE_STRATEGY = 'cache-first';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only cache image requests from our Appwrite storage
  if (event.request.method === 'GET' && url.pathname.includes('/storage/buckets/')) {
    if (IMAGE_CACHE_STRATEGY === 'cache-first') {
      event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
          return cache.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              // Return cached image
              return cachedResponse;
            }

            // Fetch and cache new image
            return fetch(event.request).then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
        })
      );
    }
  }
});