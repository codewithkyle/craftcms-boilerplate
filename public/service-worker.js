let resourcesCacheId = 'initial';

self.addEventListener('fetch', (event) => {
	const noCache = event.request.url.match(/(\/webmaster\/)|(\/cpresources\/)|(index\.php)|(cachebust)|(\/pwa\/)/gi);
	if (noCache) {
		event.respondWith(
			fetch(event.request).then((response) => {
				return response;
			}),
		);
	} else {
		event.respondWith(
			caches.match(event.request).then((response) => {
				if (response) {
					return response;
				}

				return fetch(event.request).then((response) => {
					if (!response || response.status !== 200 || response.type !== 'basic') {
						return response;
					}

					var responseToCache = response.clone();

					caches.open(resourcesCacheId).then((cache) => {
						cache.put(event.request, responseToCache);
					});
					return response;
				});
			}),
		);
	}
});

self.addEventListener('message', (event) => {
	const { type } = event.data;
	switch (type) {
		case 'cachebust':
			cachebust();
			break;
		case 'page-refresh':
			updatePageCache(event.data.url, event.data.network);
			break;
		default:
			console.error(`Unknown Service Worker message type: ${type}`);
			break;
	}
});

async function cachebust() {
	const request = await fetch(`/pwa/cachebust`, {
		cache: 'no-cache',
		credentials: 'include',
	});
	if (request.ok) {
		const response = await request.json();
		if (response.success) {
			resourcesCacheId = response.resourcesCache;
			caches.keys().then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName !== resourcesCacheId) {
							return caches.delete(cacheName);
						}
					}),
				);
			});
		}
	}
}

async function updatePageCache(url, network) {
	try {
		const request = new Request(url);
		const cachedResponse = await caches.match(request);
		await new Promise((resolve) => {
			caches.open(resourcesCacheId).then((cache) => {
				cache.delete(request).then(() => {
					resolve();
				});
			});
		});
		if (network === '4g') {
			await new Promise((resolve) => {
				fetch(request).then((response) => {
					if (!response || response.status !== 200 || response.type !== 'basic') {
						resolve();
					}
					caches.open(resourcesCacheId).then((cache) => {
						cache.put(request, response);
						resolve();
					});
				});
			});
		}
		const clients = await self.clients.matchAll();
		clients.map((client) => {
			if (client.visibilityState === 'visible' && client.url === url) {
				client.postMessage({
					type: 'page-refresh',
				});
			}
		});
	} catch (error) {
		console.error(error);
	}
}
