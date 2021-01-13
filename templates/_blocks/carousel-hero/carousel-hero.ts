export default class CarouselHeroComponent extends HTMLElement {
	private slides: Array<HTMLElement>;
	private buttons: Array<HTMLButtonElement>;
	private index: number;
	private progressBar: HTMLElement;
	private loop: Function;
	private time: number;
	private dirty: boolean;
	private timer: number;
	private touched: boolean;

	constructor() {
		super();
		this.slides = Array.from(this.querySelectorAll("carousel-slide"));
		this.buttons = Array.from(this.querySelectorAll("carousel-controls button"));
		this.index = 0;
		this.progressBar = this.querySelector("carousel-timer");
		this.loop = null;
		this.dirty = false;
		this.timer = 0;
		this.touched = false;
	}

	private switchSlide(newSlideIndex: number): void {
		this.dirty = true;
		this.setAttribute("state", "changing");
		const currentSlide = this.slides[this.index];
		const newSlide = this.slides[newSlideIndex];

		currentSlide.style.opacity = "0";
		currentSlide.style.visibility = "hidden";
		currentSlide.style.zIndex = "1";
		currentSlide.classList.remove("is-active");

		newSlide.style.opacity = "1";
		newSlide.style.visibility = "visible";
		newSlide.style.zIndex = "5";
		newSlide.classList.add("is-active");

		this.buttons.map((button) => {
			button.classList.remove("is-active");
		});
		this.buttons[newSlideIndex].classList.add("is-active");

		this.index = newSlideIndex;
		this.timer = 0;
		this.progressBar.style.transform = `scaleX(0)`;
		this.progressBar.setAttribute("aria-valuenow", "0");
		this.dirty = false;
	}

	private handleButtonClickEvent = (e: Event): void => {
		if (this.dirty) {
			return;
		}
		const button = e.currentTarget as HTMLButtonElement;
		this.switchSlide(parseInt(button.dataset.index));
		this.loop = () => {};
	};

	private callback(): void {
		const newTime = performance.now();
		const dt = (newTime - this.time) / 1000;
		this.time = newTime;

		if (document.hasFocus() && !this.dirty) {
			this.timer += dt;
			const progress = this.timer / 7;
			this.progressBar.style.transform = `scaleX(${progress})`;
			this.progressBar.setAttribute("aria-valuenow", `${Math.round(progress * 100)}%`);
			if (this.timer >= 7) {
				let newIndex = this.index + 1;
				if (newIndex >= this.buttons.length) {
					newIndex = 0;
				}
				this.switchSlide(newIndex);
			}
			if (this.touched) {
				this.progressBar.style.display = "none";
			}
		}

		window.requestAnimationFrame(() => {
			this.loop();
		});
	}

	disconnectedCallback(): void {
		this.loop = () => {};
	}

	connectedCallback(): void {
		if (this.buttons.length) {
			this.buttons[0].parentElement.style.visibility = "visible";
			this.buttons[0].parentElement.style.opacity = "1";

			this.buttons.map((button) => {
				button.addEventListener("click", this.handleButtonClickEvent);
			});

			this.loop = this.callback.bind(this);
			this.time = performance.now();
			this.setAttribute("state", "running");
			this.loop();
		}
	}
}
