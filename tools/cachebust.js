const fs = require('fs');

fs.readFile('public/service-worker.js', (error, buffer) => {
    if (error)
    {
        console.log(error);
        return;
    }
    let data = buffer.toString().replace(/const currentTimestamp.*\;/g, `const currentTimestamp = '${ Date.now() }';`);
    fs.writeFile('public/service-worker.js', data, (error) => {
        if (error)
        {
            console.log(error);
            return;
        }
    });
});