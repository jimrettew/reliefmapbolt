// Service Worker for ReliefMap PWA
const CACHE_NAME = 'reliefmap-v1.0.0';
const urlsToCache = [
  '/',
  '/logo.png',
  '/manifest.json',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Cache resources individually to handle failures gracefully
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(error => {
              console.warn('Failed to cache:', url, error);
              return null; // Continue with other resources
            })
          )
        );
      })
      .catch(error => {
        console.error('Cache installation failed:', error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip webpack dev server files and API calls
  if (event.request.url.includes('webpack') || 
      event.request.url.includes('.hot-update.') ||
      event.request.url.includes('sockjs-node') ||
      event.request.url.includes('/api/') ||
      event.request.method !== 'GET') {
    return; // Let the browser handle these requests normally
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(error => {
        console.error('Fetch failed:', error);
        // For navigation requests, try to serve the index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        // For other requests, let the browser handle the error
        throw error;
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .catch(error => {
      console.error('Cache cleanup failed:', error);
    })
  );
});
