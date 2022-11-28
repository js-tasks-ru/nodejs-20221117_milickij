const { isNumber } = require("lodash");

function sum(a, b) {

  if (isNumber(a) && isNumber(b)) {
    return a + b;
  }
  else {
    throw new TypeError('value is not number')
  }
}

module.exports = sum;