import { broadcaster } from './broadcaster';
import { debug, env, uuid } from './env';
import { notify } from '../packages/notify.js';

interface PjaxState {
	activeRequestUid: string,
}

class Pjax {
	private state: PjaxState;
	private worker: Worker;
	private serviceWorker: ServiceWorker;

	constructor() {
		this.state = {
			activeRequestUid: null,
		};
		this.worker = null;
		this.serviceWorker = null;
		this.init();
	}

	private init(): void {
		if (!sessionStorage.getItem('prompts'))
		{
			sessionStorage.setItem('prompts', '0');
		}
		broadcaster.hookup('pjax', this.inbox.bind(this));
		this.worker = new Worker(`${window.location.origin}/assets/pjax-worker.js`);
		this.worker.onmessage = this.handleWorkerMessage.bind(this);
		window.addEventListener('popstate', this.windowPopstateEvent);
		window.history.replaceState({ url: window.location.href }, document.title, window.location.href);
		if ('serviceWorker' in navigator)
		{
			navigator.serviceWorker
			.register(`${window.location.origin}/service-worker.js`, { scope: '/' })
			.then((reg) => {
				if (navigator.serviceWorker.controller) {
					this.serviceWorker = navigator.serviceWorker.controller;
					this.serviceWorker.postMessage({
						type: 'cachebust',
						url: window.location.href
					});
					navigator.serviceWorker.onmessage = this.handleServiceWorkerMessage.bind(this);
					broadcaster.message('pjax', { type: 'revision-check' });
					broadcaster.message('pjax', { type: 'hijack-links' });
				}
			})
			.catch((error) => {
				console.error('Registration failed with ' + error);
			});
		}
		else
		{
			broadcaster.message('pjax', { type: 'hijack-links' });
		}
	}

	private inbox(data: MessageData): void {
		const { type } = data;
		switch (type) {
			case 'revision-check':
				this.checkPageRevision();
				break;
			case 'hijack-links':
				this.collectLinks();
				break;
			case 'load':
				this.navigate(data.url, data?.history);
				break;
			case 'navigation-update':
				this.updateHistory(data.title, data.url, data.history);
				this.collectLinks();
				this.checkPageRevision();
				break;
			default:
				if (debug) {
					console.warn(`Undefined Pjax message type: ${type}`);
				}
				break;
		}
	}

	private navigate(url:string, history:string = 'push'): void
	{
		const ticket = env.startLoading();
		const requestUid = uuid();
		this.state.activeRequestUid = requestUid;
		this.worker.postMessage({
			type: 'pjax',
			ticket: ticket,
			url: url,
			requestUid: requestUid,
			history: history,
		});
	}

	private windowPopstateEvent:EventListener = this.hijackPopstate.bind(this);
	private hijackPopstate(e:PopStateEvent): void
	{
		if (e.state?.url)
		{
			broadcaster.message('pjax', {
				type: 'load',
				url: e.state.url,
				history: 'replace',
			});
		}
	}

	private updateHistory(title:string, url:string, history): void
	{
		if (history === 'replace')
		{
			window.history.replaceState({
				url: url,
			}, title, url);
		}
		else
		{
			window.history.pushState({
				url: url,
			}, title, url);
		}
	}

	private handleLinkClick:EventListener = this.hijackRequest.bind(this);
	private hijackRequest(e:Event): void
	{
		e.preventDefault();
		const target = e.currentTarget as HTMLAnchorElement;
		broadcaster.message('pjax', {
			type: 'load',
			url: target.href,
		});
	}

	private collectLinks(): void
	{
		const unregisteredLinks = Array.from(document.body.querySelectorAll('a[href]:not([pjax-tracked]):not([no-transition]):not([target]):not(.no-transition)'));
		if (unregisteredLinks.length)
		{
			unregisteredLinks.map((link:HTMLAnchorElement) => {
				link.setAttribute('pjax-tracked', 'true');
				link.addEventListener('click', this.handleLinkClick);
			});
		}
	}

	private handleServiceWorkerMessage(e: MessageEvent): void {
		const { type } = e.data;
		switch (type) {
			case 'page-refresh':
				let promptCount = parseInt(sessionStorage.getItem('prompts'));
				promptCount = promptCount + 1;
				sessionStorage.setItem('prompts', `${ promptCount }`);
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
			case 'set-max-prompts':
				sessionStorage.setItem('maxPrompts', `${ e.data.max }`);
				const currentPromptCount = sessionStorage.getItem('prompts');
				if (parseInt(currentPromptCount) >= e.data.max)
				{
					sessionStorage.setItem('prompts', '0');
					this.serviceWorker.postMessage({
						type: 'clear-content-cache'
					});
				}
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
				if (e.data.status === 'stale') {
					this.serviceWorker.postMessage({
						type: 'page-refresh',
						url: e.data.url,
						network: env.connection,
					});
				}
				break;
			case 'pjax':
				if (e.data.requestUid === this.state.activeRequestUid)
				{
					if (e.data.status === 'ok')
					{
						this.swapPjaxContent(e.data.body, e.data.ticket, e.data.url, e.data.history);
					}
					else
					{
						if (debug)
						{
							console.error(`Failed to fetch page: ${ e.data.url }. Server responded with: ${ e.data.error }`);
						}
						window.location.href = e.data.url;
					}
				}
				else
				{
					env.stopLoading(e.data.ticket);
					if (e.data.status !== 'ok' && debug)
					{
						console.error(`Failed to fetch page: ${ e.data.url }. Server responded with: ${ e.data.error }`);
					}
				}
				break;
			default:
				if (debug) {
					console.error(`Undefined Pjax Worker response message type: ${type}`);
				}
				break;
		}
	}

	private swapPjaxContent(html:string, ticket:string, url:string, history:string)
	{
		const tempDocument:HTMLDocument = document.implementation.createHTMLDocument('pjax-temp-document');
		tempDocument.documentElement.innerHTML = html;
		const main = tempDocument.querySelector('main');
		if (main)
		{
			const currentMain = document.body.querySelector('main');
			currentMain.innerHTML = main.innerHTML;
			document.title = tempDocument.title;
			broadcaster.message('pjax', {
				type: 'navigation-update',
				url: url,
				title: tempDocument.title,
				history: history,
			});
			env.stopLoading(ticket);
		}
		else
		{
			window.location.href = url;
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
