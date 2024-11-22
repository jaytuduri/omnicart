// Cache version - change this to force cache refresh
const CACHE_VERSION = '14';
const CACHE_NAME = `omnicart-v${CACHE_VERSION}`;
const ASSETS_TO_CACHE = [
    '/omnicart/',
    '/omnicart/index.html',
    '/omnicart/styles.css',
    '/omnicart/app.js',
    '/omnicart/categories.js',
    '/omnicart/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting()) // Force activation
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all clients immediately
            self.clients.claim()
        ])
    );
});

// Fetch event - network first for HTML, cache first for other assets
self.addEventListener('fetch', event => {
    // Parse the URL
    const requestURL = new URL(event.request.url);
    
    // Network-first strategy for HTML files to ensure fresh content
    if (requestURL.pathname.endsWith('.html') || requestURL.pathname.endsWith('/')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clonedResponse);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Cache-first strategy for other assets
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(response => {
                    // Don't cache API calls
                    if (event.request.url.includes('api.mymemory.translated.net')) {
                        return response;
                    }
                    
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
    );
});
