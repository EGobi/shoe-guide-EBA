const path = require('path');
const request = require('./lib/request');

module.exports = (options = {}) => {

  options = Object.assign(options);

  return request(options);
};
