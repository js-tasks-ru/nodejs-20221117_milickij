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
    case 'DELETE':

      try {
        if (pathname.includes('/')) {
          res.statusCode = 400;
          res.end('Bad request');
          return;
        }

        if (fs.existsSync(filepath)) {
          fs.unlink(filepath, () => {
            res.statusCode = 200;
            res.end('ok');
          });
          return;
        } else {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }
      } catch (error) {
        res.statusCode = 500;
        res.end('Internal error')
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
