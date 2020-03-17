// @ts-nocheck
let resourcesCacheId = "resources-initial";
let contentCacheId = "content-initial";
self.addEventListener("fetch", event => {
    const noCache = event.request.url.match(new RegExp(/(\/webmaster\/)|(\/cpresources\/)|(index\.php)|(cachebust\.js)|(\/pwa\/)|(\.json)$/gi));
    if (noCache || event.request.method !== "GET") {
        event.respondWith(fetch(event.request).then(response => {
            return response;
        }));
    }
    else {
        const isResource = event.request.url.match(/(\.js)$|(\.css)$|(\.mjs)$|(\.cjs)$/gi);
        const cacheName = isResource ? resourcesCacheId : contentCacheId;
        event.respondWith(caches.match(event.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request, {
                redirect: "follow",
            }).then(response => {
                if (!response || response.status !== 200 || response.type !== "basic" || response.headers.get("PWA-Cache") === "no-cache" || response.redirected) {
                    return response;
                }
                var responseToCache = response.clone();
                caches.open(cacheName).then(cache => {
                    cache.put(event.request, responseToCache);
                });
                return response;
            });
        }));
    }
});
self.addEventListener("message", event => {
    const { type } = event.data;
    switch (type) {
        case "cachebust":
            cachebust(event.data.url);
            break;
        case "page-refresh":
            updatePageCache(event.data.url, event.data.network);
            break;
        case "clear-content-cache":
            clearContentCache();
            break;
        default:
            console.error(`Unknown Service Worker message type: ${type}`);
            break;
    }
});
function clearContentCache() {
    caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(cacheName => {
            if (cacheName.match("content")) {
                return caches.delete(cacheName);
            }
        }));
    });
}
function informClientOfCachebustValues(maximumContentPrompts, contentCacheDuration, url) {
    clients = self.clients.matchAll().then(clients => {
        clients.map(client => {
            if (client.visibilityState === "visible" && client.url === url) {
                client.postMessage({
                    type: "cachebust",
                    max: parseInt(maximumContentPrompts),
                    contentCacheExpires: parseInt(contentCacheDuration),
                });
            }
        });
    });
}
async function cachebust(url) {
    const request = await fetch(`/resources-cachebust.json`, {
        cache: "no-cache",
        credentials: "include",
        headers: new Headers({
            Accept: "application/json",
        }),
    });
    if (request.ok) {
        const response = await request.json();
        resourcesCacheId = `resources-${response.cacheTimestamp}`;
        caches.keys().then(cacheNames => {
            return Promise.all(cacheNames.map(cacheName => {
                if (new RegExp(/resources/i).test(cacheName) && cacheName !== resourcesCacheId) {
                    return caches.delete(cacheName);
                }
            }));
        });
    }
    const request2 = await fetch("/pwa/cachebust.json", {
        cache: "no-cache",
        credentials: "include",
        headers: new Headers({
            Accept: "application/json",
        }),
    });
    if (request2.ok) {
        const response = await request2.json();
        contentCacheId = `content-${response.cacheTimestamp}`;
        caches.keys().then(cacheNames => {
            return Promise.all(cacheNames.map(cacheName => {
                if (new RegExp(/content/i).test(cacheName) && cacheName !== contentCacheId) {
                    return caches.delete(cacheName);
                }
            }));
        });
        informClientOfCachebustValues(response.maximumContentPrompts, response.contentCacheDuration, url);
    }
    else {
        if (contentCacheId === "content-initial") {
            contentCacheId = `content-${Date.now()}`;
            caches.keys().then(cacheNames => {
                return Promise.all(cacheNames.map(cacheName => {
                    if (new RegExp(/content/i).test(cacheName) && cacheName !== contentCacheId) {
                        return caches.delete(cacheName);
                    }
                }));
            });
        }
        informClientOfCachebustValues(4, 7, url);
    }
}
async function updatePageCache(url, network) {
    try {
        const request = new Request(url);
        await new Promise(resolve => {
            caches.open(contentCacheId).then(cache => {
                cache.delete(request).then(() => {
                    resolve();
                });
            });
        });
        if (network === "4g") {
            await new Promise(resolve => {
                fetch(url, {
                    credentials: "include",
                }).then(response => {
                    if (!response || response.status !== 200 || response.type !== "basic") {
                        resolve();
                    }
                    caches.open(contentCacheId).then(cache => {
                        cache.put(request, response);
                        resolve();
                    });
                });
            });
        }
        const clients = await self.clients.matchAll();
        clients.map(client => {
            if (client.visibilityState === "visible" && client.url === url) {
                client.postMessage({
                    type: "page-refresh",
                });
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}
