import { broadcaster } from './broadcaster';
import { debug, env } from './env';
import { notify } from '../packages/notifyjs.js';

interface PjaxState {
	entryId: string;
}

class Pjax {
	private state: PjaxState;
	private worker: Worker;
	private serviceWorker: ServiceWorker;

	constructor() {
		this.state = {
			entryId: document.documentElement.dataset.entryId,
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
					this.serviceWorker = navigator.serviceWorker.controller;
					this.serviceWorker.postMessage({
						type: 'cachebust',
					});
					navigator.serviceWorker.onmessage = this.handleServiceWorkerMessage.bind(this);
					broadcaster.message('pjax', { type: 'revision-check' });
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
				notify({
					message: 'A new version of this page is available.',
					closeable: true,
					force: true,
					duration: Infinity,
					buttons: [
						{
							label: 'Reload',
							callback: () => {
								window.location.reload();
							},
						},
					],
				});
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
			url: window.location.href,
		});
	}
}
new Pjax();
