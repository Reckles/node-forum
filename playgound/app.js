const http = require('http');
const fs = require('fs');

function onRequest (req, res) {
    fs.readFile('./index.html');
}

http.createServer(onRequest).listen(8000);