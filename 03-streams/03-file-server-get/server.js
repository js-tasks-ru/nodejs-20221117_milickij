const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Bad request');
         break;
      }

      if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end('Not found');
        break;
      }

      const stream = fs.createReadStream(filepath);

      stream.on('error', function (error) {
        res.statusCode = 500;
        res.end('Internal error');
      })

      req.on('aborted', () => stream.destroy());
      
      stream.pipe(res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
