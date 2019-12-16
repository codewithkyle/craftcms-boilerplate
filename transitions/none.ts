export function noneAuto(newHTML: string): Promise<{}> {
	return new Promise(resolve => {
		window.scroll({
			top: 0,
			left: 0,
			behavior: 'auto',
		});
		const main = document.body.querySelector('main');
		main.innerHTML = newHTML;
		resolve();
	});
}
export function noneSmoothScroll(newHTML: string): Promise<{}> {
	return new Promise(resolve => {
		window.scroll({
			top: 0,
			left: 0,
			behavior: 'smooth',
		});
		const main = document.body.querySelector('main');
		main.innerHTML = newHTML;
		resolve();
	});
}
