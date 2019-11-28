class Env {
	public isDebug: boolean
	public connection: NetworkType
	public cpu: number
	public memory: number | null
	public isProduciton: boolean

	private _tickets: Array<string>

	constructor() {
		this.memory = null
		this.cpu = window.navigator.hardwareConcurrency
		this.connection = '4g'
		this.isDebug = document.documentElement.getAttribute('debug') ? true : false
		this.isProduciton = document.documentElement.dataset.environment === 'production'

		this._tickets = []

		this.init()
	}

	private init(): void {
		try {
			// @ts-ignore
			this.connection = window.navigator.connection.effectiveType
			// @ts-ignore
			this.memory = window.navigator.deviceMemory
		} catch (error) {
			if (this.isDebug) {
				console.warn(error)
			}
		}

		if (!this.memory) {
			this.memory = 4
		}
	}

	/**
	 * Attempts to set the DOM to the `idling` state. The DOM will only idle when all `startLoading()` methods have been resolved.
	 * @param ticket - the `string` the was provided by the `startLoading()` method.
	 */
	public stopLoading(ticket: string): void {
		if (!ticket || typeof ticket !== 'string') {
			console.error(`A ticket with the typeof 'string' is required to end the loading state.`)
			return
		}

		for (let i = 0; i < this._tickets.length; i++) {
			if (this._tickets[i] === ticket) {
				this._tickets.splice(i, 1)
				break
			}
		}

		if (this._tickets.length === 0) {
			document.documentElement.setAttribute('state', 'idling')
		}
	}

	/**
	 * Sets the DOM to the `soft-loading` state.
	 * @returns a ticket `string` that is required to stop the loading state.
	 */
	public startLoading(): string {
		document.documentElement.setAttribute('state', 'soft-loading')
		const ticket = this.uuid()
		this._tickets.push(ticket)
		return ticket
	}

	public startPageTransition(): void {
		document.documentElement.setAttribute('state', 'page-loading')
	}

	public endPageTransition(): void {
		document.documentElement.setAttribute('state', 'page-loading-complete')
		setTimeout(() => {
			if (this._tickets.length) {
				document.documentElement.setAttribute('state', 'soft-loading')
			} else {
				document.documentElement.setAttribute('state', 'idling')
			}
		}, 600)
	}

	/**
	 * Quick and dirty unique ID generation.
	 * This method does not follow RFC 4122 and does not guarantee a universally unique ID.
	 * @see https://tools.ietf.org/html/rfc4122
	 */
	public uuid(): string {
		return new Array(4)
			.fill(0)
			.map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16))
			.join('-')
	}
}
export const env: Env = new Env()
export const debug: boolean = env.isDebug
export const uuid: Function = env.uuid
