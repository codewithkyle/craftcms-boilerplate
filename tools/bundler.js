const fs = require('fs');
const rollup = require('rollup');
const rollupPluginNodeResolve = require('rollup-plugin-node-resolve');
const rollupPluginCommonjs = require('rollup-plugin-commonjs');
const glob = require('glob');

class Bundler
{
    constructor()
    {
        this.run();
    }

    async run()
    {
        try
        {
            const files = await this.getFiles();
            const unbundledFiles = await this.scrubFiles(files);
            await this.bundle(unbundledFiles);
            await this.tsNoCheckFiles(unbundledFiles);
        }
        catch (error)
        {
            console.log(error);
        }
    }

    tsNoCheckFiles(files)
    {
        return new Promise((resolve, reject) => {
            let scrubbed = 0;
            for (let i = 0; i < files.length; i++)
            {
                const file = files[i];
                fs.readFile(file, (error, buffer) => {
                    if (error)
                    {
                        reject(error);
                    }

                    const data = buffer.toString();
                    if (!data.match(/(\/\/\s\@ts\-nocheck)/g))
                    {
                        let newData = '// @ts-nocheck\n\n';
                        newData += data;
                        fs.writeFile(file,newData, (error) => {
                            if (error)
                            {
                                reject(error);
                            }

                            scrubbed++;
                            if (scrubbed === files.length)
                            {
                                resolve();
                            }
                        });
                    }
                    else
                    {
                        scrubbed++;
                        if (scrubbed === files.length)
                        {
                            resolve();
                        }
                    }
                });
            }
        });
    }

    bundle(files)
    {
        return new Promise((resolve, reject) => {
            let bundled = 0;
            for (let i = 0; i < files.length; i++)
            {
                const file = files[i];
                const filename = file.replace(/.*\//g, '');
                const inputOptions = {
                    input: file,
                    plugins: [
                        rollupPluginNodeResolve({
                            mainFields: ['browser', 'module', 'jsnext:main'],
                            extensions: [ '.mjs', '.js', '.json'],
                            browser: true
                        }),
                        rollupPluginCommonjs({
                            include: /node_modules/,
                            extensions: ['.cjs', '.js']
                        })
                    ]
                };
                const outputOptions = {
                    file: file,
                    format: 'iife'
                };
                this.build(inputOptions, outputOptions)
                .then(()=>{
                    bundled++;
                    if (bundled === files.length)
                    {
                        resolve();
                    }
                })
                .catch(err => {
                    reject(err);
                });
            }
        });
    }

    build(inputOptions, outputOptions)
    {
        return new Promise((resolve, reject)=>{
            (async ()=>{
                try
                {
                    const bundle = await rollup.rollup(inputOptions);
                    await bundle.write(outputOptions); 
                    resolve();
                }
                catch (err)
                {
                    reject(err)
                }
            })();
        });
    }

    scrubFiles(files)
    {
        return new Promise((resolve, reject) => {
            let scrubbed = 0;
            const validFiles = [];
            for (let i = 0; i < files.length; i++)
            {
                const file = files[i];
                fs.readFile(file, (error, buffer) => {
                    if (error)
                    {
                        reject(error);
                    }

                    let importStatements = buffer.toString().match(/(import\s)|(import\{)/g);
                    if (importStatements)
                    {
                        validFiles.push(file);
                    }

                    scrubbed++;
                    if (scrubbed === files.length)
                    {
                        resolve(validFiles)
                    }
                });
            }
        });
    }

    getFiles()
    {
        return new Promise((resolve, reject) => {
            glob('packages/*.js', (error, files) => {
                if (error)
                {
                    reject(error);
                }

                resolve(files);
            });
        });
    }
}
new Bundler();