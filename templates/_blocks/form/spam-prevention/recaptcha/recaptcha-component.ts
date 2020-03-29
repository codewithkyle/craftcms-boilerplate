class RecaptchaComponent extends HTMLElement {
	connectedCallback() {
		if (document.head.querySelector(`script[src="https://www.google.com/recaptcha/api.js?render=${this.dataset.publicKey}"]`)) {
			return;
		}
		const script = document.createElement("script");
		script.src = `https://www.google.com/recaptcha/api.js?render=${this.dataset.publicKey}`;
		script.addEventListener("load", () => {
			// @ts-ignore
			grecaptcha.ready(() => {
				// @ts-ignore
				grecaptcha.execute(this.dataset.publicKey, { action: "form" }).then((token) => {
					const input = this.querySelector("input");
					input.value = token;
				});
			});
		});
		document.head.appendChild(script);
	}
}
customElements.define("recaptcha-component", RecaptchaComponent);
