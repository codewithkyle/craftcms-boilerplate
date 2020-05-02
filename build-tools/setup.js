const fs = require("fs");
const path = require("path");
const cwd = process.cwd();

const envPath = path.join(cwd, ".env");
if (!fs.existsSync(envPath)) {
	const envExamplePath = path.join(cwd, ".env.example");
	fs.copyFileSync(envExamplePath, envPath);
}
