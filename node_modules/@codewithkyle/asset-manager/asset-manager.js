#!/usr/bin/env node

const packageJson = require("./package.json");
const semver = require("semver");
const version = packageJson.engines.node;

if (!semver.satisfies(process.version, version)) {
    const rawVersion = version.replace(/[^\d\.]*/, "");
    console.log(`Asset Manager requires Node v${rawVersion} or newer and you're using ${process.version}`);
    process.exit(1);
}

const path = require("path");
const cwd = process.cwd();
const fs = require("fs");

const defaultConfig = require("./default.config");

const customConfigPath = path.join(cwd, "asset-manager.config.js");
let customConfig = {};
if (fs.existsSync(customConfigPath)){
    customConfig = require(customConfigPath);
}

const config = Object.assign(defaultConfig, customConfig);
const outFile = path.resolve(cwd, config.output);

if (!Array.isArray(config.src)){
    config.src = [config.src];
}

let allFiles = [];
let publicFiles = [];
const glob = require("glob");
for (let i = 0; i < config.src.length; i++){
    const newFiles = glob.sync(config.src[i].files) ?? [];
    allFiles = [...allFiles, ...newFiles];
    for (let j = 0; j < newFiles.length; j++){
        publicFiles.push(`/${config.src[i].publicDir.replace(/^\/|\/$/g, "").trim()}/${newFiles[j].replace(/.*[\/\\]/, "").trim()}`);
    }
}

let totalSize = 0;

for (let i = 0; i < allFiles.length; i++){
    const stats = fs.statSync(allFiles[i]);
    totalSize = stats.size;
}

var crypto = require('crypto');
var name = `${allFiles.length}-${totalSize}-${new Date().getTime()}`;
var hash = crypto.createHash('md5').update(name).digest('hex');

if (fs.existsSync(outFile)){
    fs.unlinkSync(outFile);
}

let fileData = `
self.manifest = {
    "version": "${hash}",
    "assets": [${publicFiles.map((file, index) => {return "\n\t\t\"" + file + "\"";})}\n\t]
}
`;

fs.writeFileSync(outFile, fileData);