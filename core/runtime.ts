import { env, debug } from './env';
import { broadcaster } from './broadcaster';

interface WorkerResponse {
	type: 'eager' | 'lazy' | 'parse';
	files: Array<ResourceObject>;
	requestUid: string|null
}

type WebComponentLoad = null | 'lazy' | 'eager';

class Runtime {
	private _bodyParserWorker: Worker;
	private _io: IntersectionObserver;
	private _loadingMessage: HTMLElement;

	constructor() {
		this._bodyParserWorker = new Worker(`${window.location.origin}/assets/runtime-worker.js`);
		this._loadingMessage = document.body.querySelector('page-loading span');
		window.addEventListener('load', this.handleLoadEvent);
	}

	/**
	 * Initializes the Runtime class.
	 */
	private init(): void {
		this._loadingMessage.innerHTML = 'Collecting resources';
		broadcaster.hookup('runtime', this.inbox.bind(this));
		this._bodyParserWorker.postMessage({
			type: 'eager',
			body: document.body.innerHTML,
		});
		this._bodyParserWorker.onmessage = this.handleWorkerMessage.bind(this);
		this._io = new IntersectionObserver(this.intersectionCallback);
	}
	private handleLoadEvent: EventListener = this.init.bind(this);

	/**
	 * The public inbox for the Runtime class. All incoming messages sent through the `Broadcaster` will be received here.
	 * @param data - the `MessageData` passed into the inbox by the `Broadcaster` class
	 */
	private inbox(data: MessageData): void {
		const { type } = data;
		switch (type) {
			case 'load':
				this.fetchResources(data.resources);
				break;
			case 'mount-components':
				this.handleWebComponents();
				break;
			case 'parse':
				this.parseHTML(data.body, data.requestUid);
				break;
			default:
				if (debug) {
					console.warn(`Undefined runtime message type: ${type}`);
				}
				return;
		}
	}

	/**
	 * Handles the incoming message from the Runtime web worker.
	 * @param e - the `MessageEvent` object
	 */
	private handleWorkerMessage(e: MessageEvent) {
		const response: WorkerResponse = e.data;
		switch (response.type) {
			case 'eager':
				this._loadingMessage.innerHTML = `Loading resource: <resource-counter>0</resource-counter<span class="-slash">/</span><resource-total>${response.files.length}</resource-total>`;
				this.fetchResources(response.files).then(() => {
					document.documentElement.setAttribute('state', 'idling');
					this._bodyParserWorker.postMessage({
						type: 'lazy',
						body: document.body.innerHTML,
					});
					this.handleWebComponents();
				});
				break;
			case 'lazy':
				const ticket = env.startLoading();
				this.fetchResources(response.files).then(() => {
					env.stopLoading(ticket);
				});
				break;
			case 'parse':
				/** Fetch the requested CSS files */
				this.fetchResources(response.files).then(() => {
					/** Tell the Pjax class that the CSS files have been loaded */
					broadcaster.message('pjax', {
						type: 'css-ready',
						requestUid: response.requestUid
					});
				});
				break;
			default:
				console.warn(`Unknown response type from Body Parser worker: ${response.type}`);
				break;
		}
	}

	/**
	 * Passes the HTML parse request onto the Runtime web worker.
	 * @param body - the body text to be parsed
	 * @param requestUid - the navigation request unique id
	 */
	private parseHTML(body:string, requestUid:string): void
	{
		this._bodyParserWorker.postMessage({
			type: 'parse',
			body: body,
			requestUid: requestUid,
		});
	}

	/**
	 * Upgrades a custom element into a web component using the dynamic import syntax.
	 * @param customElementTagName - the JavaScript filename
	 * @param customElement - the `Element` that has been upgraded
	 * @see https://v8.dev/features/dynamic-import
	 */
	private upgradeToWebComponent(customElementTagName: string, customElement: Element): void {
		import(`./${customElementTagName}.js`).then(() => {
			customElement.setAttribute('state', 'mounted');
		});
	}

	/**
	 * When a custom element is observed by the `IntersectionObserver` API unobserve the element and attempt to upgrade the web component.
	 * @param entries - an array of `IntersectionObserverEntry` objects
	 */
	private handleIntersection(entries: Array<IntersectionObserverEntry>) {
		for (let i = 0; i < entries.length; i++) {
			if (entries[i].isIntersecting) {
				this._io.unobserve(entries[i].target);
				const customElement = entries[i].target.tagName.toLowerCase().trim();
				if (customElements.get(customElement) === undefined) {
					this.upgradeToWebComponent(customElement, entries[i].target);
				} else {
					entries[i].target.setAttribute('state', 'mounted');
				}
			}
		}
	}
	private intersectionCallback: IntersectionObserverCallback = this.handleIntersection.bind(this);

	/**
	 * Appends resources to the documents head if it hasn't already been loaded.
	 * @param resourceList - an array of `ResourceObject` objects
	 */
	private fetchResources(resourceList: Array<ResourceObject>): Promise<{}> {
		return new Promise((resolve) => {
			if (resourceList.length === 0) {
				resolve();
			}

			let loaded = 0;
			for (let i = 0; i < resourceList.length; i++) {
				const filename = resourceList[i].filename;
				let el = document.head.querySelector(`link[file="${filename}.css"]`) as HTMLLinkElement;
				if (!el) {
					el = document.createElement('link');
					el.setAttribute('file', `${filename}.css`);
					document.head.append(el);
					el.setAttribute('rel', 'stylesheet');
					el.href = `${window.location.origin}/assets/${filename}.css`;
					el.addEventListener('load', () => {
						loaded++;
						this._loadingMessage.innerHTML = `Loading resource: <resource-counter>${loaded}</resource-counter<span class="-slash">/</span><resource-total>${resourceList.length}</resource-total>`;
						if (loaded === resourceList.length) {
							resolve();
						}
					});
					el.addEventListener('error', () => {
						loaded++;
						this._loadingMessage.innerHTML = `Loading resource: <resource-counter>${loaded}</resource-counter<span class="-slash">/</span><resource-total>${resourceList.length}</resource-total>`;
						if (loaded === resourceList.length) {
							resolve();
						}
					});
				} else {
					loaded++;
					this._loadingMessage.innerHTML = `Loading resource: <resource-counter>${loaded}</resource-counter<span class="-slash">/</span><resource-total>${resourceList.length}</resource-total>`;
					if (loaded === resourceList.length) {
						resolve();
					}
				}
			}
		});
	}

	/**
	 * Collect all custom elements tagged with a `web-component` attribute that have not already been tracked.
	 * If the custom element is tagged with `loading="eager"` upgrade the custom element otherwise track the
	 * custom element with the `IntersectionObserver` API.
	 */
	private handleWebComponents(): void {
		const customElements = Array.from(document.body.querySelectorAll('[web-component]:not([state])'));
		for (let i = 0; i < customElements.length; i++) {
			const element = customElements[i];
			const loadType = element.getAttribute('loading') as WebComponentLoad;
			if (loadType === 'eager') {
				const customElement = element.tagName.toLowerCase().trim();
				this.upgradeToWebComponent(customElement, element);
			} else {
				element.setAttribute('state', 'unseen');
				this._io.observe(customElements[i]);
			}
		}
	}
}
export const runtime: Runtime = new Runtime();
