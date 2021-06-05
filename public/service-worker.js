self.importScripts('./service-worker-assets.js');

self.addEventListener('install', event => event.waitUntil(onInstall(event)));
self.addEventListener('activate', event => event.waitUntil(onActivate(event)));
self.addEventListener('fetch', event => event.respondWith(onFetch(event)));

const resourceCacheNamePrefix = 'resource-cache-';
const resourceCache = `${resourceCacheNamePrefix}${self.manifest.version}`;
const imageCacheNamePrefix = "image-cache-";
const imgCache = `${imageCacheNamePrefix}${self.manifest.version}`;

// Cache files when the service worker is installed or updated
async function onInstall(event) {
    self.skipWaiting();
    const assetsRequests = self.manifest.assets.map(asset => {
        return new Request(asset, {
            cache: "reload",
        });
    });
    for (const request of assetsRequests){
        await caches.open(resourceCache).then(cache => cache.add(request)).catch(error => {
            console.error("Failed to cache:", request, error);
        });
    }
}

// Cleanup old caches
async function onActivate(event) {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys
        .filter(key => key.startsWith(resourceCacheNamePrefix) && key !== resourceCache)
        .map(key => caches.delete(key)));
    await Promise.all(cacheKeys
        .filter(key => key.startsWith(imageCacheNamePrefix) && key !== imgCache)
        .map(key => caches.delete(key)));
}

// Try to respond with cached files
async function onFetch(event) {
    if (event.request.method === 'GET' && event.request.url.indexOf(self.origin) === 0) {
        let cachedResponse = null;
        if (event.request.url.indexOf("/jitter/") !== -1){
            const cache = await caches.open(imgCache);
            cachedResponse = await cache.match(event.request);
        } else {
            const cache = await caches.open(resourceCache);
            cachedResponse = await cache.match(event.request);
        }
        if (cachedResponse){
            return cachedResponse;
        }
    }
    return tryFetch(event.request);
}

async function tryFetch(request){
    const response =  await fetch(request);
    // Skip caching bad responses
    if (!response || response.status !== 200 || response.type !== "basic" && response.type !== "cors" || response.redirected) {
        return response;
    }
    // Cache image responses
    if (response.type === "basic" && response.url.indexOf("/jitter/") !== -1){
        const responseToCache = response.clone();
        const cache = await caches.open(imgCache);
        await cache.put(request, responseToCache);
    }
    return response;
}
