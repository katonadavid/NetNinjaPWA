const staticCacheName = 'site-static-v2';
const dynamicCacheName = 'site-dynamic-v1';

// If we request / we get index.html, it gets cached
const assets = [
    '/',
    '/index.html',
    '/pages/fallback.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/materialize.min.css',
    '/css/styles.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v129/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2'
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            cache.addAll(assets);
            console.log('cached assets');
        })
    );
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => {
            console.log(keys);
            return Promise.all(keys.filter(key => key !== staticCacheName && key !== dynamicCacheName).map(key => caches.delete(key)));
        })
    )
})

self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then(cacheResponse => {
        return cacheResponse || fetch(event.request).then(fetchResponse => {
            return caches.open(dynamicCacheName).then(cache => {
                cache.put(event.request.url, fetchResponse.clone());
                return fetchResponse;
            });
        }).catch(() => caches.match('/pages/fallback.html'));
    }));
})