export function slide(newHTML: string): Promise<{}> {
	return new Promise(resolve => {
		window.scroll({
			top: 0,
			left: 0,
			behavior: 'smooth',
		});

		/** Prepare for update */
		const currentMain = document.body.querySelector('main');
		const newMain = document.createElement('main');
		newMain.innerHTML = newHTML;
		newMain.dataset.id = currentMain.dataset.id;
		newMain.style.transform = 'translateX(-100vw)';
		currentMain.before(newMain);

		/** Transition reset */
		currentMain.style.transform = 'translateX(0)';
		currentMain.style.opacity = '1';
		currentMain.style.position = 'absolute';
		currentMain.style.top = '0';
		currentMain.style.left = '0';
		currentMain.style.width = '100vw';

		setTimeout(() => {
			/** Transition */
			currentMain.style.transition = 'transform 600ms ease-in-out';
			currentMain.style.transform = 'translateX(100vw)';
			newMain.style.transition = 'transform 600ms ease-in-out';
			newMain.style.transform = 'translateX(0)';

			setTimeout(() => {
				currentMain.remove();
				resolve();
			}, 615);
		}, 15);
	});
}
