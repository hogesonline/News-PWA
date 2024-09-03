const staticAssets = [
    './',
    './app.js',
    './styles.css'
];

self.addEventListener('install', async event => {
    console.log('Service worker installing...');
    const cache = await caches.open('news-static');
    cache.addAll(staticAssets);
}
);

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url)
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(request)); 
    } else {
        event.respondWith(networkFirst(request));
    }
    
    
});

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
}

async function networkFirst(request) {
    const cache = await caches.open('news-dynamic')
    try {
        console.log('Fetching:', request.url);
        const response = await fetch(request);
        cache.put(request, response.clone());
        return response;
    } catch(error) {
        await cache.match(request);
    }
}
