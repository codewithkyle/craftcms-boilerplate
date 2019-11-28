/** Incoming request from the Runtime class. */
onmessage = (e: MessageEvent) => {
	switch (e.data.type) {
		case 'eager':
			parseEagerLoadedCSS(e.data.body);
			break;
		case 'lazy':
			parseLazyLoadedCSS(e.data.body);
			break;
		case 'parse':
			parseCSS(e.data.body, e.data.requestUid);
			break;
	}
};

/**
 * Handles sending a message back to the Runtime class.
 * @param responseType - the parsing response type
 * @param fileNames - an array of `ResoucesObject` objects
 * @param requestUid - the navigation request unique id
 */
function respondWithFiles(responseType: 'eager' | 'lazy' | 'parse', fileNames: Array<ResourceObject>, requestUid:string = null) {
	// @ts-ignore
	postMessage({
		type: responseType,
		files: fileNames,
		requestUid: requestUid,
	});
}

/**
 * Parses HTML and collects all requested CSS files.
 * @param body - the body text to be parsed
 * @param requestUid - the navigation request unique id
 */
function parseCSS(body:string, requestUid:string)
{
	/** Match all `load-css` attributes (eager-load-css and lazy-load-css) and returns the attributes value */
	const matches = body.match(/(load\-css\=[\'\"].*?[\/\'\"])/gi);

	if (matches === null || matches.length === 0)
	{
		respondWithFiles('parse', [], requestUid);
		return;
	}

	for (let i = 0; i < matches.length; i++)
	{
		matches[i] = matches[i].replace(/(load\-css\=)|[\'\"]/gi, '');
	}
	
	/** Gets all filenames from the matched attributes */
	const files: Array<string> = [];
	if (matches) {
		matches.map((match: string) => {
			const filenames = match.trim().split(' ');
			if (filenames) {
				filenames.map((filename) => {
					const cleanFilename = filename.trim().toLowerCase().replace(/(\.css)$|(\.scss)$/g, '');
					if (cleanFilename !== '') {
						files.push(cleanFilename);
					}
				});
			}
		});
	}

	/** Verify that the file names are unique */
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
	respondWithFiles('parse', uniqueFiles, requestUid);
}

/**
 * Parses HTML for all `lazy-load-css` attributes and collects all unique file names.
 * @param body - the body text to be parsed
 */
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
/**
 * Parses HTML for all `eager-load-css` attributes and collects all unique file names.
 * @param body - the body text to be parsed
 */
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
