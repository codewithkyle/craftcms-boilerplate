import { env, debug } from './env';

interface WorkerResponse
{
    type: 'eager'|'lazy',
    files: Array<ResourceObject>,
}

type WebComponentLoad = null|'lazy'|'eager';

class Runtime
{
    private _bodyParserWorker : Worker;
    private _io : IntersectionObserver;

    private _counter : HTMLElement;
    private _counterTotal : HTMLElement;

    constructor()
    {
        this._bodyParserWorker = new Worker(`${ window.location.origin }/assets/body-parser.js`);
        this._counter = document.body.querySelector('resource-counter');
        this._counterTotal = document.body.querySelector('resource-total');
    }

    private intersectionCallback:IntersectionObserverCallback = this.handleIntersection.bind(this);

    public init() : void
    {
        this._bodyParserWorker.postMessage({
            type: 'eager',
            body: document.body.innerHTML
        });
        this._bodyParserWorker.onmessage = this.handleWorkerMessage.bind(this);
        this._io = new IntersectionObserver(this.intersectionCallback);
    }

    private upgradeToWebComponent(customElementTagName:string, customElement:Element) : void
    {
        import(`./${ customElementTagName }.js`).then(() => {
            customElement.setAttribute('state', 'loaded');
        });
    }

    private handleIntersection(entries:Array<IntersectionObserverEntry>)
    {        
        for (let i = 0; i < entries.length; i++)
        {
            if (entries[i].isIntersecting)
            {
                this._io.unobserve(entries[i].target);
                const customElement = entries[i].target.tagName.toLowerCase().trim();
                this.upgradeToWebComponent(customElement, entries[i].target);
            }
        }
    }

    private handleWorkerMessage(e:MessageEvent)
    {
        const response:WorkerResponse = e.data;
        switch (response.type)
        {
            case 'eager':
                this._counter.innerHTML = '0';
                this._counterTotal.innerHTML = `${ response.files.length }`;
                this.fetchResources(response.files).then(() => {
                    document.documentElement.setAttribute('state', 'idling');
                    this._bodyParserWorker.postMessage({
                        type: 'lazy',
                        body: document.body.innerHTML
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
            default:
                console.warn(`Unknown response type from Body Parser worker: ${ response.type }`);
                break;
        }
    }

    private async fetchFile(element:Element, filename:string, filetype:string)
    {
        const url = `${ window.location.origin }/assets/${ filename }.${ filetype }`;
        switch (filetype)
        {
            case 'css':
                element.setAttribute('rel', 'stylesheet');
                element.setAttribute('href', url);
                break;
            case 'js':
                element.setAttribute('type', 'module');
                element.setAttribute('src', url);
                break;
            case 'mjs':
                element.setAttribute('type', 'module');
                element.setAttribute('src', url);
                break;
            default:
                console.warn(`Unknown file type requested: ${ filename }.${ filetype }`);
                break;
        }
    }

    public fetchResources(resourceList:Array<ResourceObject>) : Promise<{}>
    {
        return new Promise((resolve) => {
            if (resourceList.length === 0)
            {
                resolve();
            }

            let loaded = 0;
            for (let i = 0; i < resourceList.length; i++)
            {
                const filename = resourceList[i].filename;
                const filetype = resourceList[i].extension;
                const element:string = (resourceList[i].extension === 'css') ? 'link' : 'script';
                let el = document.head.querySelector(`${ element }[file="${ filename }.${ filetype }"]`);
                if (!el)
                {
                    el = document.createElement(element);
                    el.setAttribute('file', `${ filename }.${ filetype }`);
                    document.head.append(el);
                    el.addEventListener('load', () => {
                        loaded++;
                        this._counter.innerHTML = `${ loaded }`;
                        if (loaded === resourceList.length)
                        {
                            resolve();
                        }
                    });
                    
                    this.fetchFile(el, filename, filetype);
                }
                else
                {
                    loaded++;
                    if (loaded === resourceList.length)
                    {
                        resolve();
                    }
                }
            }
        });
    }

    private handleWebComponents() : void
    {
        const customElements = Array.from(document.body.querySelectorAll('[web-component]:not([state])'));
        for (let i = 0; i < customElements.length; i++)
        {
            const element = customElements[i];
            const loadType = element.getAttribute('loading') as WebComponentLoad;

            if (loadType === 'eager')
            {
                const customElement = element.tagName.toLowerCase().trim();
                this.upgradeToWebComponent(customElement, element);
            }
            else
            {
                element.setAttribute('state', 'unseen');
                this._io.observe(customElements[i]);
            }
        }
    }
}
export const runtime:Runtime = new Runtime();