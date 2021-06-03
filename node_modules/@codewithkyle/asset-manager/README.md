# Asset Manager

A simple build tool for managing your Service Worker resource cache.

## Install

```bash
npm i -S @codewithkyle/asset-manager
```

## Usage

### package.json

```json
{
    "scripts": {
        "wrangle": "asset-manager"
    }
}
```

### asset-manager.config.js

Note that the `publicDir` value should be a path relative to your projects root web directory and it should be accessible to the Service Worker (within it's scope).

```javascript
module.exports = {
    src: [
        {
            files: "./public/js/*.js",
            publicDir: "/js"
        },
        {
            files: "./public/css/*.css",
            publicDir: "/css"
        }
    ],
    output: "./public/service-worker-assets.js",
};
```

### Example Service Worker

```html
<script>navigator.serviceWorker.register('service-worker.js');</script>
```

```javascript
self.importScripts('./service-worker-assets.js');

self.addEventListener('install', event => event.waitUntil(onInstall(event)));
self.addEventListener('activate', event => event.waitUntil(onActivate(event)));
self.addEventListener('fetch', event => event.respondWith(onFetch(event)));

const cacheNamePrefix = 'resource-cache-';
const cacheName = `${cacheNamePrefix}${self.manifest.version}`;

// Cache files when the service worker is installed or updated
async function onInstall(event) {
    self.skipWaiting();
    const assetsRequests = self.manifest.assets.map(asset => {
        return new Request(asset.url, {
            cache: "reload",
        });
    });
    for (const request of assetsRequests){
        await caches.open(cacheName).then(cache => cache.add(request)).catch(error => {
            console.error("Failed to cache:", request, error);
        });
    }
}

// Cleanup old caches
async function onActivate(event) {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys
        .filter(key => key.startsWith(cacheNamePrefix) && key !== cacheName)
        .map(key => caches.delete(key)));
}

// Try to respond with cached files
async function onFetch(event) {
    if (event.request.method === 'GET' && event.request.url.indexOf(self.origin) === 0) {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse){
            return cachedResponse;
        }
    }
    return fetch(event.request);
}
```
