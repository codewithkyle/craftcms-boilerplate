const fs = require('fs');

fs.readFile('public/cachebust.js', (error, buffer) => {
	if (error) {
		console.log(error);
		return;
	}
	let data = buffer.toString().replace(/\d+/g, `${Date.now()}`);
	fs.writeFile('public/cachebust.js', data, (error) => {
		if (error) {
			console.log(error);
			return;
		}
	});
});
