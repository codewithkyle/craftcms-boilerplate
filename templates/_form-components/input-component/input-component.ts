class InputComponent extends HTMLElement {
	private input: HTMLInputElement;

	constructor() {
		super();
		this.input = this.querySelector(`input:not([type="hidden"])`);
	}

	private validate(): void {
		if (this.input.value === "") {
			this.classList.remove("has-value");
		} else {
			this.classList.add("has-value");
		}

		if (this.classList.contains("is-invalid")) {
			return;
		}

		if (!this.input.validity.valid) {
			this.classList.add("is-invalid");
			this.input.reportValidity();
			return;
		}

		if (this.input.type === "email" && new RegExp(/\S+@\S+\.\S+/).test(this.input.value) === false) {
			this.classList.add("is-invalid");
			this.input.setCustomValidity("Invalid email address format.");
			this.input.reportValidity();
			return;
		}

		this.classList.remove("is-invalid");
	}
	private handleBlurEvent: EventListener = this.validate.bind(this);

	private clearCustomError(): void {
		if (this.classList.contains("is-invalid")) {
			this.input.setCustomValidity("");
			this.input.reportValidity();
			this.classList.remove("is-invalid");
		}
	}
	private handleKeyboardEvent: EventListener = this.clearCustomError.bind(this);

	connectedCallback() {
		this.input.addEventListener("blur", this.handleBlurEvent);
		this.input.addEventListener("keypress", this.handleKeyboardEvent);
	}
}
customElements.define("input-component", InputComponent);
