// @ts-nocheck

/**
 * Handles setting up the Google Analytics GTag library.
 * @param {string} id - the gtag site ID
 */
export function setupGoogleAnalytics(id) {
	if (!id) {
		return;
	}
	window.dataLayer = window.dataLayer || [];
	function gtag() {
		dataLayer.push(arguments);
	}
	gtag('js', new Date());
	gtag('config', id);
}

/**
 * Updates the page path using the GTag library.
 * @param {string} path - the new pages pathname
 * @param {string} id - the gtag site ID
 */
export function sendPageView(path, id) {
	if (!path || !id) {
		return;
	}
	gtag('config', id, { page_path: path });
}
