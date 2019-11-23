const glob = require('glob');
const fs = require('fs');

class ScriptScrubber
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
            await this.scrubFiles(files);
            
        }
        catch (error)
        {
            console.log(error);
        }
    }

    scrubFiles(files)
    {
        return new Promise((resolve, reject) => {
            let scrubbed = 0;
            for (let i = 0; i < files.length; i++)
            {
                const filePath = files[i];
                const filename = filePath.replace(/.*\//g, '');
                fs.readFile(filePath, (error, buffer) => {
                    if (error)
                    {
                        reject(error);
                    }

                    let data = buffer.toString();
                    let importFilePaths = data.match(/(?<=from\s+[\'\"]).*(?=[\'\"]\;)/g);
                    
                    if (importFilePaths)
                    {
                        importFilePaths.map((path) => {
                            let pathFileName = path.replace(/.*\//g, '').replace(/(\.ts)|(\.js)$/g, '');
                            data = data.replace(`${ path }`, `./${ pathFileName }.js`);
                        });
                    }

                    fs.writeFile(`public/assets/${ filename }`, data, (error) => {
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
                });
            }
        });
    }

    getFiles()
    {
        return new Promise((resolve, reject) => {
            glob('_compiled/**/*.js', (error, files) => {
                if (error)
                {
                    reject(error);
                }

                resolve(files);
            });
        });
    }
}
new ScriptScrubber();