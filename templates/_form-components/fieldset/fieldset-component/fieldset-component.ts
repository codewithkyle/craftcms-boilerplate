class FieldsetComponent extends HTMLElement {
	private inputs: NodeListOf<HTMLInputElement>;
	constructor() {
		super();
		this.inputs = this.querySelectorAll("input");
	}
	private validate(e: Event): void {
		const input = e.currentTarget as HTMLInputElement;
		if (input.checked) {
			this.classList.remove("is-invalid");
			this.inputs.forEach(inputEl => {
				inputEl.parentElement.classList.remove("is-invalid");
			});
		} else {
			let foundOnceCheck = false;
			this.inputs.forEach(inputEl => {
				if (inputEl.checked) {
					foundOnceCheck = true;
				}
			});
			if (foundOnceCheck) {
				this.classList.remove("is-invalid");
				this.inputs.forEach(inputEl => {
					inputEl.parentElement.classList.remove("is-invalid");
				});
			} else {
				this.classList.add("is-invalid");
				this.inputs.forEach(inputEl => {
					inputEl.parentElement.classList.add("is-invalid");
				});
			}
		}
	}
	private handleChangeEvent: EventListener = this.validate.bind(this);
	connectedCallback() {
		this.inputs.forEach(input => {
			input.addEventListener("change", this.handleChangeEvent);
		});
	}
}
customElements.define("fieldset-component", FieldsetComponent);
