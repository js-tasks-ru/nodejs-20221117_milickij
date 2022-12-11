const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const fileMaxSize = 1024 * 1024 // 1 MB

  const limitedStream = new LimitSizeStream({ limit: fileMaxSize });

  req.on('aborted', () => {
    limitedStream.destroy();
    fs.unlinkSync(filepath);
    return;
  });

  switch (req.method) {
    case 'POST':

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File already exist');
        return;
      }


      limitedStream.on('error', function () {
        fs.unlink(filepath, () => {
          res.statusCode = 413;
          res.end('The file is too large');
        });

        return;
      })

      limitedStream.on('end', () => {
        res.statusCode = 201;
        res.end('ok');
      });

      const writeStream = fs.createWriteStream(filepath);

      req.pipe(limitedStream).pipe(writeStream);

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
