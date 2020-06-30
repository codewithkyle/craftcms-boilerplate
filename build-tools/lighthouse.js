const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const fs = require("fs");

if (!fs.existsSync("./audits")) {
	fs.mkdirSync("./audits");
}
function launchChromeAndRunLighthouse(url, flags, config = null) {
	return chromeLauncher.launch({ chromeFlags: flags.chromeFlags }).then((chrome) => {
		flags.port = chrome.port;
		return lighthouse(url, flags, config).then((results) => {
			return chrome.kill().then(() => results);
		});
	});
}

const flags = {
	chromeFlags: ["--show-paint-rects"],
};
const config = {
	extends: "lighthouse:default",
	settings: {
		budgetPath: "./budget.json",
	},
};
launchChromeAndRunLighthouse("http://boilerplate.local/", flags, config).then((res) => {
	fs.writeFileSync(`./audits/${new Date().toISOString()}.json`, res.report);
	const report = JSON.parse(res.report);
	console.log("\n");
	const date = new Date(report.fetchTime);
	console.log(`Lighthouse v${report.lighthouseVersion} Report | Generated on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}\n`);
	console.log("---=[ Performance ]=---");
	console.log(`Overall: ${report.categories.performance.score * 100}`);
	console.log(`FCP: ${report.audits["first-contentful-paint"].score * 100}/100 (${Math.round(report.audits["first-contentful-paint"].numericValue / 1000)}s)`);
	console.log(`FMP: ${report.audits["first-meaningful-paint"].score * 100}/100 (${Math.round(report.audits["first-meaningful-paint"].numericValue / 1000)}s)`);
	console.log(`Speed Index: ${report.audits["speed-index"].score * 100}/100 (${Math.round(report.audits["speed-index"].numericValue / 1000)}s)`);
	console.log(`Max FID: ${report.audits["max-potential-fid"].score * 100}/100 (${report.audits["max-potential-fid"].displayValue.replace(/\s+/g, "")})`);
	console.log(`First CPU Idle: ${Math.round(report.audits["first-cpu-idle"].numericValue / 1000)}s`);
	console.log(`Time to Interactive: ${Math.round(report.audits["interactive"].numericValue / 1000)}s`);
	console.log(`Bootup Time: ${Math.round(report.audits["bootup-time"].numericValue / 1000)}s`);
	console.log(`Minified CSS: ${report.audits["unminified-css"].score !== 1 ? "Failed" : "Passed"}`);
	console.log(`Minified JS: ${report.audits["unminified-javascript"].score !== 1 ? "Failed" : "Passed"}`);
	console.log(`DOM Size: ${report.audits["dom-size"].numericValue > 400 ? "Failed" : "Passed"}`);
	console.log(`Noopener: ${report.audits["external-anchors-use-rel-noopener"].score ? "Passed" : "Failed"}`);
	console.log("");
	console.log("---=[ Accessability ]=---");
	console.log(`Overall: ${report.categories.accessibility.score * 100}`);
	console.log(`Contrast: ${report.audits["color-contrast"].score === 1 ? "Passed" : "Failed"}`);
	console.log(`Alt Tags: ${report.audits["image-alt"].score === 1 ? "Passed" : "Failed"}`);
	console.log(`Valid Tab Indexes: ${report.audits["tabindex"].score === 1 ? "Passed" : "Failed"}`);
	console.log(`Tap Targets: ${report.audits["tap-targets"].score === 1 ? "Passed" : "Failed"}`);
	if (report.audits["label"].score) {
		console.log(`Form Labels: ${report.audits["label"].score === 1 ? "Passed" : "Failed"}`);
	}
	// console.log("");
	// console.log("---=[ Budget ]=---");
	// for (let i = 0; i < report.audits["resource-summary"].details.items.length; i++) {
	// 	console.log(`${report.audits["resource-summary"].details.items[i].label}: ${Math.round(report.audits["resource-summary"].details.items[i].size * 0.001)}kb`);
	// }
});
