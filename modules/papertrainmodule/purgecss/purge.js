const { PurgeCSS } = require('purgecss');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).argv;
const html = argv.html;
const css = argv.css;

const purgeCSS = new PurgeCSS();
purgeCSS.purge({
	content: [html],
	css: [css],
	defaultExtractor: (content) => content.match(/[\d\w-:.]+(?<!\:)/g) || [],
}).then(purgeCSSResult => {
	console.log(purgeCSSResult[0].css);
	process.exit(0);
});
