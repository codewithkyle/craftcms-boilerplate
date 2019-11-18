let currentTimestamp = 'initial';

self.addEventListener('fetch', (event) => {
	const noCache = event.request.url.match(/(\/webmaster\/)|(\/cpresources\/)|(index\.php)|(cachebust\.js)/gi);
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

					caches.open(currentTimestamp).then((cache) => {
						cache.put(event.request, responseToCache);
					});
					return response;
				});
			}),
		);
	}
});

self.addEventListener('message', (event) => {
	if (event.data.cachebust) {
		currentTimestamp = event.data.cachebust;
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== currentTimestamp) {
						return caches.delete(cacheName);
					}
				}),
			);
		});
	}
});
