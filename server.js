var fs = require('fs');

fs.readdir("/var/www/html", (err, data) => {
    console.log(data);
});