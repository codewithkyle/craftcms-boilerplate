const fs = require('fs');

fs.readFile('config/pwa.php', (error, buffer) => {
	if (error) {
		console.log(error);
		return;
	}
	const timestamp = Date.now();
	let data = buffer.toString();
	data = data.replace(/\'resourcesCache\'.*\,/g, `'resourcesCache' => '${ timestamp }',`);
	data = data.replace(/\'contentCache\'.*\,/g, `'contentCache' => '${ timestamp }',`);
	fs.writeFile('config/pwa.php', data, (error) => {
		if (error) {
			console.log(error);
			return;
		}
	});
});
