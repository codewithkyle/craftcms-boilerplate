#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const semver = require("semver");
const sass = require("node-sass");
const yargs = require("yargs").argv;
const minify = require("minify");
const ora = require("ora");
const PurgeCSS = require("purgecss").PurgeCSS;

const cwd = process.cwd();

/** Verify Nodejs version */
const packageJson = require(path.join(__dirname, "package.json"));
const version = packageJson.engines.node;
if (!semver.satisfies(process.version, version)) {
    const rawVersion = version.replace(/[^\d\.]*/, "");
    console.log(`CSSMonster requires at least Node v${rawVersion} and you're using Node ${process.version}`);
    process.exit(1);
}

/** Get config file path */
const configFile = yargs.c || yargs.config;
let configPath;
if (configFile) {
    configPath = path.resolve(cwd, configFile);
    if (!fs.existsSync(configPath)) {
        console.log(`Missing config file. Did you move the file without updating the --config flag?`);
        process.exit(1);
    }
} else {
    configPath = path.join(cwd, "cssmonster.js");
    if (!fs.existsSync(configPath)) {
        configPath = path.join(cwd, "cssmonster.config.js");
        if (!fs.existsSync(configPath)) {
            configPath = null;
        }
    }
}

const config = require(configPath) || null;
let mode = yargs.e || yargs.env || "production";

/** Output CSS */
class CSSMonster {
    constructor() {
        this.tempDir = path.join(__dirname, "temp");
        this.config = {
            env: mode,
            outDir: path.resolve(cwd, "cssmonster"),
            sources: [path.resolve(cwd, "src")],
            minify: true,
            purge: true,
            purgeCSS: null,
            blacklist: [],
            include: [],
            autoresolve: false,
        };
        this.run();
    }

    reset() {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(this.tempDir)) {
                fs.rmdirSync(this.tempDir, { recursive: true });
            }
            fs.mkdir(this.tempDir, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    handleConfig() {
        return new Promise((resolve, reject) => {
            if (!config) {
                resolve();
            }
            /** Update outDir */
            if (typeof config.outDir !== "undefined") {
                if (typeof config.outDir === "string") {
                    this.config.outDir = path.resolve(cwd, config.outDir);
                } else {
                    reject("Incorrect configuration: outDir must be a string.");
                }
            }

            /** Update sources array */
            if (typeof config.sources !== "undefined") {
                if (typeof config.sources === "string") {
                    this.config.sources = [path.resolve(cwd, config.sources)];
                } else if (Array.isArray(config.sources)) {
                    this.config.sources = [];
                    for (let i = 0; i < config.sources.length; i++) {
                        const srcPath = path.resolve(cwd, config.sources[i]);
                        this.config.sources.push(srcPath);
                    }
                } else {
                    reject("Incorrect configuration: sources must be a string or an array of strings.");
                }
            }

            /** Override CLI env value */
            if (typeof config.env !== "undefined") {
                if (typeof config.env === "string") {
                    if (config.env !== "production" || config.env !== "development" || config.env !== "dev") {
                        this.config.env = config.env;
                    } else {
                        reject(`Incorrect configuration: env must be 'production' or 'development' or 'dev'.`);
                    }
                } else {
                    reject("Incorrect configuration: env must be a boolean.");
                }
            }

            /** Set purgeCSS options */
            if (typeof config.purgeCSS !== "undefined") {
                if (typeof config.purgeCSS === "object") {
                    this.config.purgeCSS = config.purgeCSS;
                } else {
                    reject("Incorrect configuration: purgeCSS must be a purgeCSS config object. See https://www.purgecss.com/configuration#options for additional information.");
                }
            }

            /** Update sources array */
            if (typeof config.blacklist !== "undefined") {
                if (typeof config.blacklist === "string") {
                    this.config.blacklist = [path.resolve(cwd, config.blacklist)];
                } else if (Array.isArray(config.blacklist)) {
                    this.config.blacklist = [];
                    for (let i = 0; i < config.blacklist.length; i++) {
                        const filePath = path.resolve(cwd, config.blacklist[i]);
                        this.config.blacklist.push(filePath);
                    }
                } else {
                    reject("Incorrect configuration: blacklist must be a string or an array of strings.");
                }
            }

            /** Purge */
            if (typeof config.purge !== "undefined") {
                if (typeof config.purge === "boolean") {
                    this.config.purge = config.purge;
                } else {
                    reject("Incorrect configuration: purge must be a boolean.");
                }
            }

            /** Minify */
            if (typeof config.minify !== "undefined") {
                if (typeof config.minify === "boolean") {
                    this.config.minify = config.minify;
                } else {
                    reject("Incorrect configuration: minify must be a boolean.");
                }
            }

            /** Set values based on env */
            if (this.config.env === "dev" || this.config.env === "development") {
                this.config.minify = false;
                this.config.purge = false;
            }

            /** Included paths */
            if (typeof this.config.include !== "undefined") {
                if (typeof config.include === "string") {
                    this.config.include = [path.resolve(cwd, config.include)];
                } else if (Array.isArray(config.include)) {
                    this.config.include = [];
                    for (let i = 0; i < config.include.length; i++) {
                        const filePath = path.resolve(cwd, config.include[i]);
                        this.config.include.push(filePath);
                    }
                }
            }

            /** autoresolve */
            if (typeof config.autoresolve !== "undefined") {
                if (typeof config.autoresolve === "boolean") {
                    this.config.autoresolve = config.autoresolve;
                } else {
                    reject("Incorrect configuration: autoresolve must be a boolean.");
                }
            }

            resolve();
        });
    }

    removeIgnored(files) {
        return new Promise((resolve) => {
            if (!files.length || !this.config.blacklist.length) {
                resolve(files);
            }
            const cleanFiles = [];
            for (let i = 0; i < files.length; i++) {
                let allowed = true;
                for (let k = 0; k < this.config.blacklist.length; k++) {
                    if (new RegExp(this.config.blacklist[k]).test(files[i])) {
                        allowed = false;
                        break;
                    }
                }
                if (allowed) {
                    cleanFiles.push(files[i]);
                }
            }
            resolve(cleanFiles);
        });
    }

    getCSSFiles() {
        return new Promise((resolve, reject) => {
            if (!this.config.sources.length) {
                reject("Missing source paths.");
            }
            let files = [];
            for (let i = 0; i < this.config.sources.length; i++) {
                const newFiles = glob.sync(`${this.config.sources[i]}/**/*.css`);
                files = [...files, ...newFiles];
            }
            resolve(files);
        });
    }

    copyCSS(files) {
        return new Promise((resolve, reject) => {
            if (!files.length) {
                resolve(files);
            }
            const movedFiles = [];
            let count = 0;
            for (let i = 0; i < files.length; i++) {
                const filename = files[i].replace(/(.*\/)|(.*\\)/, "");
                if (!fs.existsSync(`${this.tempDir}/${filename}`)) {
                    fs.copyFileSync(files[i], `${this.tempDir}/${filename}`);
                    movedFiles.push(`${this.tempDir}/${filename}`);
                    count++;
                    if (count === files.length) {
                        resolve(movedFiles);
                    }
                } else {
                    if (this.config.autoresolve) {
                        const newFileData = fs.readFileSync(files[i]).toString();
                        let tempFileData = fs.readFileSync(`${this.tempDir}/${filename}`).toString();
                        tempFileData += "\n";
                        tempFileData += newFileData;
                        fs.writeFileSync(`${this.tempDir}/${filename}`, tempFileData);
                        count++;
                        if (count === files.length) {
                            resolve(movedFiles);
                        }
                    } else {
                        reject(`Two css files have the same name "${filename}". Rename one of the files or enable the CSSMonster autoresolve setting.`);
                    }
                }
            }
        });
    }

    normalizeCSS() {
        return new Promise((resolve, reject) => {
            let data = "";
            if (fs.existsSync(`${this.tempDir}/normalize.css`)) {
                data = fs.readFileSync(`${this.tempDir}/normalize.css`).toString();
            }
            const normalizePath = path.resolve(cwd, "node_modules/normalize.css/normalize.css");
            const preflightPath = path.join(__dirname, "preflight.css");
            data += fs.readFileSync(normalizePath).toString();
            data += fs.readFileSync(preflightPath).toString();
            if (fs.existsSync(`${this.tempDir}/normalize.css`)) {
                fs.unlinkSync(`${this.tempDir}/normalize.css`);
            }
            fs.writeFile(`${this.tempDir}/normalize.css`, data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    getSCSSFiles() {
        return new Promise((resolve, reject) => {
            if (!this.config.sources.length) {
                reject("Missing source paths.");
            }
            let files = [];
            for (let i = 0; i < this.config.sources.length; i++) {
                const newFiles = glob.sync(`${this.config.sources[i]}/**/*.scss`);
                files = [...files, ...newFiles];
            }
            resolve(files);
        });
    }

    compileSCSS(files) {
        return new Promise((resolve, reject) => {
            if (!files.length) {
                resolve(files);
            }
            const compiledFiles = [];
            let count = 0;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                sass.render(
                    {
                        file: file,
                        outputStyle: "expanded",
                        includePaths: this.config.include,
                    },
                    (error, result) => {
                        if (error) {
                            reject(`SCSS Error: ${error.message} at line ${error.line} ${error.file}`);
                        } else {
                            let fileName = result.stats.entry.replace(/(.*\/)|(.*\\)/, "").replace(/(.scss)$/g, "");
                            if (fileName) {
                                const newFile = `${this.tempDir}/${fileName}.css`;
                                if (!fs.existsSync(newFile)) {
                                    fs.writeFileSync(newFile, result.css.toString());
                                    compiledFiles.push(newFile);
                                    count++;
                                    if (count === files.length) {
                                        resolve(compiledFiles);
                                    }
                                } else {
                                    if (this.config.autoresolve) {
                                        let tempFileData = fs.readFileSync(newFile).toString();
                                        tempFileData += "\n";
                                        tempFileData += result.css.toString();
                                        fs.writeFileSync(newFile, tempFileData);
                                        count++;
                                        if (count === files.length) {
                                            resolve(compiledFiles);
                                        }
                                    } else {
                                        reject(`Two scss files have the same name "${fileName}". Rename one of the files or enable the CSSMonster autoresolve setting.`);
                                    }
                                }
                            } else {
                                reject("Something went wrong with the file name of " + result.stats.entry);
                            }
                        }
                    }
                );
            }
        });
    }

    minifyCSSFiles() {
        return new Promise((resolve, reject) => {
            glob(`${this.tempDir}/*.css`, (error, files) => {
                if (error) {
                    reject(error);
                } else if (!files.length || !this.config.minify) {
                    resolve();
                }
                let minified = 0;
                for (let i = 0; i < files.length; i++) {
                    minify(files[i])
                        .then((css) => {
                            fs.unlink(files[i], (error) => {
                                if (error) {
                                    reject(error);
                                }
                                fs.writeFile(files[i], css, (error) => {
                                    if (error) {
                                        reject(error);
                                    }
                                    minified++;
                                    if (minified === files.length) {
                                        resolve();
                                    }
                                });
                            });
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }
            });
        });
    }

    async commenceThePurge() {
        const purgeCSSConfig = this.config.purgeCSS;
        let normalizedContentPaths = [];
        for (let i = 0; i < purgeCSSConfig.content.length; i++) {
            const fullPath = path.resolve(cwd, purgeCSSConfig.content[i]);
            normalizedContentPaths.push(fullPath);
        }
        purgeCSSConfig.content = normalizedContentPaths;
        purgeCSSConfig.css = [`${this.tempDir}/**/*.css`];
        const purgecssResult = await new PurgeCSS().purge(purgeCSSConfig);
        const purgedFiles = [];
        purgecssResult.forEach((result) => {
            fs.unlink(result.file, (error) => {
                if (error) {
                    throw error;
                }
                fs.writeFile(result.file, result.css, (error) => {
                    if (error) {
                        throw error;
                    }
                    purgedFiles.push(result.file);
                    if (purgedFiles.length === purgecssResult.length) {
                        return purgedFiles;
                    }
                });
            });
        });
    }

    deliverCSS() {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(this.config.outDir)) {
                fs.rmdirSync(this.config.outDir, { recursive: true });
            }
            fs.rename(this.tempDir, this.config.outDir, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    cleanup() {
        return new Promise((resolve) => {
            if (fs.existsSync(this.tempDir)) {
                fs.rmdirSync(this.tempDir, { recursive: true });
            }
            resolve();
        });
    }

    async run() {
        const spinner = ora("Running CSSMonster").start();
        try {
            /** Preflight */
            await this.reset();
            spinner.text = "Updating Config";
            await this.handleConfig();

            /** Handle CSS */
            spinner.text = "Managing CSS";
            let cssFiles = await this.getCSSFiles();
            cssFiles = await this.removeIgnored(cssFiles);
            const copiedCSSFiles = await this.copyCSS(cssFiles);

            /** Handle SCSS */
            spinner.text = "Collecting SCSS";
            let scssFiles = await this.getSCSSFiles();
            scssFiles = await this.removeIgnored(scssFiles);
            spinner.text = "Compiling SCSS";
            const compiledFiles = await this.compileSCSS(scssFiles);

            /** Normalize */
            await this.normalizeCSS();

            /** PurgeCSS */
            if (this.config.purge) {
                spinner.text = "Purging CSS";
                await this.commenceThePurge();
            }

            /** Handle Minify */
            if (this.config.minify) {
                spinner.text = "Minifying CSS";
                await this.minifyCSSFiles();
            }

            /** Deliver CSS */
            spinner.text = "Delivering CSS";
            await this.deliverCSS();

            /** Finalize */
            spinner.text = "Finalizing";
            await this.cleanup();

            spinner.succeed("CSSMonster");
            process.exit(0);
        } catch (error) {
            console.log(error);
            spinner.fail(error);
            console.log("\n");
            process.exit(1);
        }
    }
}
new CSSMonster();
