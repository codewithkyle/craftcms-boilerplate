const fs = require("fs");
const path = require("path");
const cwd = process.cwd();
const glob = require("glob");

const libDir = path.join(cwd, "templates", "_lib");
if (fs.existsSync(libDir)) {
	fs.rmdirSync(libDir, { recursive: true });
}
fs.mkdirSync(libDir);

const scripts = glob.sync(`${path.join(cwd, "web_modules")}/**/*.js`);
for (let i = 0; i < scripts.length; i++){
	const script = scripts[i];
	const filename = script.replace(/.*[\/\\]/, "");
	fs.renameSync(script, path.join(libDir, filename));
}

fs.rmdirSync(path.join(cwd, "web_modules"), {recursive: true});
