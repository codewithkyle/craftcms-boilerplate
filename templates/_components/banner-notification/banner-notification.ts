export default class BannerNotification extends HTMLElement {
	connectedCallback() {
		const cachedHash = localStorage.getItem("notificationBannerHash");
		if (!cachedHash || this.dataset.hash !== cachedHash) {
			this.style.visibility = "visible";
			this.style.transform = "translateY(0)";
			const button = this.querySelector("button");
			button.addEventListener("click", () => {
				localStorage.setItem("notificationBannerHash", this.dataset.hash);
				this.remove();
			});
			// @ts-expect-error
			document?.activeElement?.blur();
			button.focus();
		}
	}
}
