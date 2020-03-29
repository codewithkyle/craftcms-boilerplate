import flatpickr from "../../../web_modules/flatpickr";

class DateComponent extends HTMLElement {
	private input: HTMLInputElement;

	constructor() {
		super();
		this.input = this.querySelector("input");
	}

	private validate(): void {
		if (this.input.value !== "") {
			this.classList.add("has-value");
		} else {
			this.classList.remove("has-value");
		}

		if (this.input.validity.valid) {
			this.classList.remove("is-invalid");
		} else {
			this.classList.add("is-invalid");
		}
	}
	private handleInputEvent: EventListener = this.validate.bind(this);

	connectedCallback() {
		flatpickr(this.input);
		this.input.addEventListener("change", this.handleInputEvent);
		this.input.addEventListener("blur", this.handleInputEvent);
	}
}
customElements.define("date-component", DateComponent);
