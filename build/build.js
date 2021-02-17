const { build } = require('esbuild');
const glob = require("glob");
const path = require("path");
const fs = require("fs");

const cwd = process.cwd();

const outDir = path.join(cwd, "_js");
if (fs.existsSync(outDir)){
    fs.rmdirSync(outDir, {recursive: true});
}
fs.mkdirSync(outDir);

const publicDir = path.join(cwd, "public", "js");
if (fs.existsSync(publicDir)){
    fs.rmdirSync(publicDir, {recursive: true});
}
fs.mkdirSync(publicDir);

const tsFiles = glob.sync(`${path.join(cwd, "templates")}/**/*.ts`) ?? [];
const jsFiles = glob.sync(`${path.join(cwd, "templates")}/**/*.js`) ?? [];
const files = [...tsFiles, ...jsFiles];

let built = 0;
for (let i = 0; i < files.length; i++){
	const file = files[i].replace(/.*[\/\\]/, "").replace(/\.ts$/, ".js").trim();
	build({
		entryPoints: [files[i]],
		bundle: false,
		outfile: path.join(outDir, file),
		minify: true,
		format: "esm",
		target: "es2020",
	})
	.catch((error) => {
		console.log(error);
		process.exit(1);
	})
	.finally(() => {
		built++;
		if (built === files.length){

		}
	});
}
