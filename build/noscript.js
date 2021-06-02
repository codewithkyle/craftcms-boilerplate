const fs = require("fs");
const path = require("path");
const cwd = process.cwd();
const glob = require("glob");

(async () => {
	const cssPath = path.join(cwd, "public", "css");
	const stylesheets = glob.sync(`${cssPath}/*.css`);
	const out = path.join(cssPath, "noscript.css");
	await fs.promises.writeFile(out, "");
	const stream = fs.createWriteStream(out, {flags:'a'});
	const blacklist = new RegExp(/brixi\.css$|normalize\.css$/);
	for (const sheet of stylesheets){
		if (!blacklist.test(sheet)){
			const data = await fs.promises.readFile(sheet, { encoding: "utf-8"});
			stream.write(data);
		}
	}
	stream.end();
})();
