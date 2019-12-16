/** Incoming request from the Runtime class. */
onmessage = (e: MessageEvent) => {
	switch (e.data.type) {
		case 'eager':
			parseEagerLoadedCSS(e.data.body).then(files => {
				// @ts-ignore
				postMessage({
					type: 'eager',
					files: files,
				});
			});
			break;
		case 'lazy':
			parseLazyLoadedCSS(e.data.body).then(files => {
				// @ts-ignore
				postMessage({
					type: 'lazy',
					files: files,
				});
			});
			break;
		case 'parse':
			parseCSS(e.data.body).then(data => {
				// @ts-ignore
				postMessage({
					type: 'parse',
					pjaxFiles: data,
					requestUid: e.data.requestUid,
				});
			});
			break;
	}
};

/**
 * Parses HTML and collects all requested CSS files.
 * @param body - the body text to be parsed
 * @param requestUid - the navigation request unique id
 */
async function parseCSS(body: string) {
	const eagerCSSFiles = await parseEagerLoadedCSS(body);
	const lazyCSSFiles = await parseLazyLoadedCSS(body);
	const uniqueFiles = { eager: eagerCSSFiles, lazy: [] };
	lazyCSSFiles.map(lazyFilename => {
		if (!eagerCSSFiles.includes(lazyFilename)) {
			uniqueFiles.lazy.push(lazyFilename);
		}
	});
	return uniqueFiles;
}

/**
 * Parses HTML for all `lazy-load-css` attributes and collects all unique file names.
 * @param body - the body text to be parsed
 */
async function parseLazyLoadedCSS(body: string) {
	const matches = body.match(/(lazy-load-css\=[\'\"].*?[\'\"])/gi);
	if (matches === null || matches.length === 0) {
		return [];
	}
	const files: Array<string> = [];
	if (matches) {
		matches.map((match: string) => {
			const clean = match.replace(/(lazy-load-css\=[\'\"])|[\'\"]$/g, '');
			const filenames = clean.trim().split(/\s+/g);
			if (filenames) {
				filenames.map(filename => {
					const cleanFilename = filename
						.trim()
						.toLowerCase()
						.replace(/(\.css)$|(\.scss)$/g, '');
					if (cleanFilename !== '') {
						files.push(cleanFilename);
					}
				});
			}
		});
	}
	const uniqueFiles: Array<string> = [];
	for (let i = 0; i < files.length; i++) {
		let isUnique = true;
		for (let k = 0; k < uniqueFiles.length; k++) {
			if (files[i] === uniqueFiles[k]) {
				isUnique = false;
			}
		}
		if (isUnique) {
			uniqueFiles.push(files[i]);
		}
	}
	return uniqueFiles;
}
/**
 * Parses HTML for all `eager-load-css` attributes and collects all unique file names.
 * @param body - the body text to be parsed
 */
async function parseEagerLoadedCSS(body: string) {
	const matches = body.match(/(eager-load-css\=[\'\"].*?[\'\"])/gi);
	if (matches === null || matches.length === 0) {
		return [];
	}
	const files: Array<string> = [];
	if (matches) {
		matches.map((match: string) => {
			const clean = match.replace(/(eager-load-css\=[\'\"])|[\'\"]$/g, '');
			const filenames = clean.trim().split(/\s+/g);
			if (filenames) {
				filenames.map(filename => {
					const cleanFilename = filename
						.trim()
						.toLowerCase()
						.replace(/(\.css)$|(\.scss)$/g, '');
					if (cleanFilename !== '') {
						files.push(cleanFilename);
					}
				});
			}
		});
	}
	const uniqueFiles: Array<string> = [];
	for (let i = 0; i < files.length; i++) {
		let isUnique = true;
		for (let k = 0; k < uniqueFiles.length; k++) {
			if (files[i] === uniqueFiles[k]) {
				isUnique = false;
			}
		}
		if (isUnique) {
			uniqueFiles.push(files[i]);
		}
	}

	return uniqueFiles;
}
