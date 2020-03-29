class RadioComponent extends HTMLElement {
	private input: HTMLInputElement;
	constructor() {
		super();
		this.input = this.querySelector("input");
	}
	private handleKeyboardEvent: EventListener = (e: KeyboardEvent) => {
		if (e.key.toLowerCase() === "enter" || e.code.toLowerCase() === "space") {
			e.preventDefault();
			this.input.checked = this.input.checked ? false : true;
		}
	};
	connectedCallback() {
		this.addEventListener("keypress", this.handleKeyboardEvent);
	}
}
customElements.define("radio-component", RadioComponent);
