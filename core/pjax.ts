import { broadcaster } from './broadcaster';
import { debug, env, uuid } from './env';
import { notify } from '../packages/notify.js';
import { sendPageView, setupGoogleAnalytics } from './gtags.js';

interface PjaxState {
	activeRequestUid: string,
}

interface Transition
{
	body: string,
	title: string,
	url: string,
	history: 'push'|'replace',
	ticket: string,
	requestUid: string,
}

class Pjax {
	private state: PjaxState;
	private worker: Worker;
	private serviceWorker: ServiceWorker;
	private transitionQueue: Array<Transition>;

	constructor() {
		this.state = {
			activeRequestUid: null,
		};
		this.worker = null;
		this.serviceWorker = null;
		this.transitionQueue = [];
		this.init();
	}

	private init(): void {
		if (!sessionStorage.getItem('prompts'))
		{
			sessionStorage.setItem('prompts', '0');
		}
		setupGoogleAnalytics();
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
				}
			})
			.catch((error) => {
				console.error('Registration failed with ' + error);
			});
		}
		broadcaster.message('pjax', { type: 'hijack-links' });
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
				sendPageView(window.location.pathname);
				break;
			case 'css-ready':
				this.swapPjaxContent(data.requestUid);
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

	private updateHistory(title:string, url:string, history:'push'|'replace'): void
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
				this.handlePjaxResponse(e.data.requestUid, e.data.status, e.data.body, e.data.ticket, e.data.url, e.data.history, e.data?.error)
				break;
			default:
				if (debug) {
					console.error(`Undefined Pjax Worker response message type: ${type}`);
				}
				break;
		}
	}

	private handlePjaxResponse(requestUid:string, status:string, body:string, ticket:string, url:string, history:'push'|'replace', error?:string)
	{
		if (requestUid === this.state.activeRequestUid)
		{
			if (status === 'ok')
			{
				const tempDocument:HTMLDocument = document.implementation.createHTMLDocument('pjax-temp-document');
				tempDocument.documentElement.innerHTML = body;
				const currentMain = document.body.querySelector('main');
				const main = tempDocument.querySelector(`main[data-id="${ currentMain.dataset.id }"]`);
				if (main && currentMain)
				{
					broadcaster.message('runtime', {
						type: 'parse',
						body: main.innerHTML,
						requestUid: requestUid,
					});
					const newTransition:Transition = {
						body: main.innerHTML,
						title: tempDocument.title,
						url: url,
						history: history,
						ticket: ticket,
						requestUid: requestUid,
					};
					this.transitionQueue.push(newTransition);
				}
				else
				{
					if (debug)
					{
						console.error('Failed to find the new and current main elements');
					}
					window.location.href = url;
				}
			}
			else
			{
				if (debug)
				{
					console.error(`Failed to fetch page: ${ url }. Server responded with: ${ error }`);
				}
				window.location.href = url;
			}
		}
		else
		{
			env.stopLoading(ticket);
			if (status !== 'ok' && debug)
			{
				console.error(`Failed to fetch page: ${ url }. Server responded with: ${ error }`);
			}
		}
	}

	private swapPjaxContent(requestUid:string)
	{
		for (let i = 0; i < this.transitionQueue.length; i++)
		{
			if (this.transitionQueue[i].requestUid === requestUid)
			{
				const transition = this.transitionQueue[i];
				if (this.state.activeRequestUid === requestUid)
				{
					const currentMain = document.body.querySelector('main');
					currentMain.innerHTML = transition.body;
					document.title = transition.title;
					broadcaster.message('pjax', {
						type: 'navigation-update',
						url: transition.url,
						title: transition.title,
						history: transition.history,
					});
					broadcaster.message('runtime', {
						type: 'mount-components',
					});
				}
				env.stopLoading(transition.ticket);
				this.transitionQueue.splice(i, 1);
				return;
			}
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
