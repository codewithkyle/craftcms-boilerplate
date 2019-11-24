let resourcesCacheId = 'resouces-initial';
let contentCacheId = 'content-initial';

self.addEventListener('fetch', (event) => {
	const noCache = event.request.url.match(/(\/webmaster\/)|(\/cpresources\/)|(index\.php)|(cachebust)|(\/pwa\/)|(\.json)$/gi);
	if (noCache || event.request.method !== 'GET') {
		event.respondWith(
			fetch(event.request).then((response) => {
				return response;
			}),
		);
	}
	else
	{
		const isResource = event.request.url.match(/(\.js)$|(\.css)$/gi);
		const cacheName = (isResource) ? resourcesCacheId : contentCacheId;

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

					caches.open(cacheName).then((cache) => {
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
		headers: new Headers({
			'Accept': 'application/json',
		})
	});
	if (request.ok) {
		const response = await request.json();
		if (response.success) {
			resourcesCacheId = `resources-${ response.resourcesCache }`;
			contentCacheId = `content-${ response.contentCache }`;
			caches.keys().then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName !== resourcesCacheId && cacheName !== contentCacheId) {
							return caches.delete(cacheName);
						}
					}),
				);
			});
		}
		else
		{
			console.error(response.error);
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
