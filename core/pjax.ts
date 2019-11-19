import { broadcaster } from './broadcaster';
import { debug, env } from './env';

interface PjaxState {
	currentPageRevision: string;
	currentPageUrl: string;
	currentPageId: string;
}

class Pjax {
	private state: PjaxState;
	private worker: Worker;
	private serviceWorker: ServiceWorker;

	constructor() {
		this.state = {
			currentPageRevision: document.documentElement.dataset.pageRevision,
			currentPageUrl: window.location.href,
			currentPageId: document.documentElement.dataset.pageId,
		};
		this.worker = null;
		this.serviceWorker = null;
		this.init();
	}

	private init(): void {
		broadcaster.hookup('pjax', this.inbox.bind(this));
		this.worker = new Worker(`${window.location.origin}/assets/pjax-worker.js`);
		this.worker.onmessage = this.handleWorkerMessage.bind(this);
		navigator.serviceWorker
			.register(`${window.location.origin}/service-worker.js`, { scope: '/' })
			.then((reg) => {
				if (navigator.serviceWorker.controller) {
					import(`${window.location.origin}/cachebust.js`)
						.then((module) => {
							this.serviceWorker = navigator.serviceWorker.controller;
							navigator.serviceWorker.onmessage = this.handleServiceWorkerMessage.bind(this);
							this.serviceWorker.postMessage({
								type: 'cachebust',
								cachebust: module.currentTimestamp,
							});
							broadcaster.message('pjax', { type: 'revision-check' });
						})
						.catch((error) => {
							console.log('The cachebust import will always fail when offline.');
						});
				}
			})
			.catch((error) => {
				console.error('Registration failed with ' + error);
			});
	}

	private inbox(data: MessageData): void {
		const { type } = data;
		switch (type) {
			case 'revision-check':
				this.checkPageRevision();
				break;
			default:
				if (debug) {
					console.warn(`Undefined Pjax message type: ${type}`);
				}
				break;
		}
	}

	private handleServiceWorkerMessage(e: MessageEvent): void {
		const { type } = e.data;
		switch (type) {
			case 'page-refresh':
				console.log('Page was refreshed');
				break;
			default:
				if (debug) {
					console.error(`Undefined Service Worker response message type: ${type}`);
				}
				break;
		}
	}

	private handleWorkerMessage(e: MessageEvent): void {
		const { type } = e.data;
		switch (type) {
			case 'revision-check':
				if (e.data.status !== 200) {
					this.serviceWorker.postMessage({
						type: 'page-refresh',
						url: e.data.url,
						network: env.connection,
					});
				}
				break;
			default:
				if (debug) {
					console.error(`Undefined Pjax Worker response message type: ${type}`);
				}
				break;
		}
	}

	private checkPageRevision() {
		this.worker.postMessage({
			type: 'revision-check',
			pageId: this.state.currentPageId,
			revision: this.state.currentPageRevision,
			url: this.state.currentPageUrl,
		});
	}
}
new Pjax();
