const glob = require('glob');
const minify = require('minify');
const fs = require('fs');

class Minify
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
            await this.minifyFiles(files);
        }
        catch (error)
        {
            console.log(error);
        }
    }

    minifyFiles(files)
    {
        return new Promise((resolve, reject) => {
            let minified = 0;
            for (let i = 0; i < files.length; i++)
            {
                minify(files[i]).then((data) => {
                    fs.writeFile(files[i], data, (error) => {
                        if (error)
                        {
                            reject(error);
                        }

                        minified++;
                        if (minified === files.length)
                        {
                            resolve();
                        }
                    });
                }).catch((error) => {
                    reject(error);
                });
            }
        });
    }

    getFiles()
    {
        return new Promise((resolve, reject) => {
            glob('public/assets/*.js', (error, files) => {
                if (error)
                {
                    reject(error);
                }

                resolve(files);
            });
        });
    }
}
new Minify();