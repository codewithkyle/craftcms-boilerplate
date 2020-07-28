class LightswitchComponent extends HTMLElement {
	private input: HTMLInputElement;
	constructor() {
		super();
		this.input = this.querySelector("input");
	}
	private validate() {
		if (this.input.required && !this.input.checked) {
			this.classList.add("is-invalid");
		} else {
			this.classList.remove("is-invalid");
		}
	}
	private handleKeyboardEvent: EventListener = (e: KeyboardEvent) => {
		if (e.key.toLowerCase() === "enter" || e.code.toLowerCase() === "space") {
			e.preventDefault();
			this.input.checked = this.input.checked ? false : true;
			this.validate();
		}
	};
	private handleChangeEvent: EventListener = () => {
		this.validate();
	};
	connectedCallback() {
		this.addEventListener("keypress", this.handleKeyboardEvent);
		this.input.addEventListener("change", this.handleChangeEvent);
	}
}
customElements.define("lightswitch-component", LightswitchComponent);
