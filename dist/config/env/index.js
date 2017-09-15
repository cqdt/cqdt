'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
  env: 'egov',
  db: 'mongodb://admin:123456@localhost:' + (process.argv[4] || 27017) + '/POC_QNI',
  port: process.argv[3] || 3000
};
var defaults = {
  root: _path2.default.join(__dirname, '/..')
};

exports.default = Object.assign(defaults, config);
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
