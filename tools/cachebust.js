const fs = require('fs');

fs.readFile('config/automation.php', (error, buffer) => {
	if (error) {
		console.log(error);
		return;
	}
	let data = buffer.toString().replace(/\d+/g, `${Date.now()}`);
	fs.writeFile('config/automation.php', data, (error) => {
		if (error) {
			console.log(error);
			return;
		}
	});
});
