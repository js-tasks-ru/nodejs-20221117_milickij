const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.encoding = options.encoding;
    this.size = 0
  }

  _transform(chunk, encoding, callback) {
    this.size += Buffer.byteLength(chunk, this.encoding);
    this.size > this.limit ? callback(new LimitExceededError()) : callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
