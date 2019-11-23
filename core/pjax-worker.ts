class PjaxWorker {
	constructor() {
		self.onmessage = this.handleMessage.bind(this);
	}

	private handleMessage(e: MessageEvent): void {
		const { type } = e.data;
		switch (type) {
			case 'revision-check':
				this.checkRevision(e.data.url);
				break;
			default:
				console.error(`Unknown Pjax Worker message type: ${type}`);
				break;
		}
	}

	/**
	 * Fetches the pages headers from the Redis server and the cached response from the service worker.
	 * @param url - the page URL that will be checked
	 */
	private checkRevision(url: string) {
		let newEtag = null;
		let cachedETag = null;

		/** Get the headers from the redis server */
		new Promise((resolve, reject) => {
			fetch(url, {
				method: 'HEAD',
				credentials: 'include',
			})
			.then(request => {
				resolve(request.headers.get('ETag'));
			})
			.catch(() => {
				reject();
			});
		})
		.then((tag) => {
			newEtag = tag;
			if (cachedETag)
			{
				this.checkETags(newEtag, cachedETag);
			}
		})
		.catch(() => {});

		/** Get the cached response from the service worker */
		new Promise((resolve, reject) => {
			fetch(url, {
				method: 'GET',
				credentials: 'include',
			})
			.then(request => {
				resolve(request.headers.get('ETag'));
			})
			.catch(() => {
				reject();
			});
		})
		.then((tag) => {
			cachedETag = tag;
			if (newEtag)
			{
				this.checkETags(newEtag, cachedETag);
			}
		})
		.catch(() => {});
	}

	/**
	 * Compares the `ETag` header from the server with the cached version.
	 * @param newTag - `ETag` header from the Redis server.
	 * @param cachedTag - `ETag` header from the service workers cached response.
	 */
	private checkETags(newTag:string, cachedTag:string)
	{
		if (newTag !== cachedTag)
		{
			console.log('New version available');
		}
	}
}
new PjaxWorker();
