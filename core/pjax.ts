import { broadcaster } from './broadcaster';
import { debug } from './env';

interface PjaxState {
	currentPageRevision: number;
	currentPageUrl: string;
	currentPageId: number;
}

class Pjax {
	private state: PjaxState;

	constructor() {
		this.state = {
			currentPageRevision: parseInt(document.documentElement.dataset.pageRevision),
			currentPageUrl: window.location.href,
			currentPageId: parseInt(document.documentElement.dataset.pageId),
		};
		broadcaster.hookup('pjax', this.inbox.bind(this));
		broadcaster.message('pjax', { type: 'revision-check' });
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

	private checkPageRevision() {
		console.log('Checking if the cached page is stale, and i changed');
	}
}
new Pjax();
