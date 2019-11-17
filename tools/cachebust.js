const fs = require('fs');

fs.readFile('config/cachebust.php', (error, buffer) => {
    if (error)
    {
        console.log(error);
        return;
    }
    let data = buffer.toString().replace(/\d+/g, Date.now());
    fs.writeFile('config/cachebust.php', data, (error) => {
        if (error)
        {
            console.log(error);
            return;
        }
    });
});