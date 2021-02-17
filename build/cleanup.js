const fs = require("fs");
const path = require("path");
const cwd = process.cwd();

const compiledPath = path.join(cwd, "_js");
if (fs.existsSync(compiledPath)) {
	fs.rmdirSync(compiledPath, { recursive: true });
}

const cssPath = path.join(cwd, "_css");
if (fs.existsSync(cssPath)) {
	fs.rmdirSync(cssPath, { recursive: true });
}
