onmessage = (e: MessageEvent) => {
	switch (e.data.type) {
		case 'eager':
			parseEagerLoadedCSS(e.data.body);
			break;
		case 'lazy':
			parseLazyLoadedCSS(e.data.body);
			break;
	}
};

function respondWithFiles(
	responseType: 'eager' | 'lazy',
	fileNames: Array<ResourceObject>,
) {
	// @ts-ignore
	postMessage({
		type: responseType,
		files: fileNames,
	});
}

function parseLazyLoadedCSS(body: string) {
	const matches = body.match(/(lazy-load-css\=[\'\"].*?[\'\"])/gi);
	const files: Array<string> = [];
	if (matches) {
		matches.map((match: string) => {
			const clean = match.replace(/(lazy-load-css\=[\'\"])|[\'\"]$/g, '');
			const filenames = clean.trim().split(' ');
			if (filenames) {
				filenames.map((filename) => {
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
	const uniqueFiles: Array<ResourceObject> = [];
	for (let i = 0; i < files.length; i++) {
		let isUnique = true;
		for (let k = 0; k < uniqueFiles.length; k++) {
			if (files[i] === uniqueFiles[k].filename) {
				isUnique = false;
			}
		}
		if (isUnique) {
			const resourceOjb: ResourceObject = {
				filename: files[i],
			};
			uniqueFiles.push(resourceOjb);
		}
	}
	respondWithFiles('lazy', uniqueFiles);
}

function parseEagerLoadedCSS(body: string) {
	const matches = body.match(/(eager-load-css\=[\'\"].*?[\'\"])/gi);
	const files: Array<string> = [];
	if (matches) {
		matches.map((match: string) => {
			const clean = match.replace(
				/(eager-load-css\=[\'\"])|[\'\"]$/g,
				'',
			);
			const filenames = clean.trim().split(' ');
			if (filenames) {
				filenames.map((filename) => {
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
	const uniqueFiles: Array<ResourceObject> = [];
	for (let i = 0; i < files.length; i++) {
		let isUnique = true;
		for (let k = 0; k < uniqueFiles.length; k++) {
			if (files[i] === uniqueFiles[k].filename) {
				isUnique = false;
			}
		}
		if (isUnique) {
			const resourceOjb: ResourceObject = {
				filename: files[i],
			};
			uniqueFiles.push(resourceOjb);
		}
	}
	respondWithFiles('eager', uniqueFiles);
}
