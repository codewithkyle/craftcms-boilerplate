const sass = require('node-sass');
const glob = require('glob');
const fs = require('fs');

if (fs.existsSync('public/assets/noscript.css')) {
	fs.unlinkSync('public/assets/noscript.css');
}

const files = glob.sync('templates/**/*.scss');
let data = '';
let rendered = 0;

files.map(file => {
	sass.render(
		{
			file: file,
			outputStyle: 'compressed',
		},
		(error, result) => {
			if (error) {
				console.log(`${error.message} at line ${error.line} ${error.file}`);
				rendered++;
				if (rendered === files.length) {
					finish();
				}
			} else {
				data += result.css;
				rendered++;
				if (rendered === files.length) {
					finish();
				}
			}
		}
	);
});

function finish() {
	fs.writeFile('public/assets/noscript.css', data, error => {
		if (error) {
			console.log(error);
		}
	});
}
