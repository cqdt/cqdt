'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mssql = require('mssql');

var _mssql2 = _interopRequireDefault(_mssql);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chat = require('../server/models/chat');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
  user: 'sa',
  password: 'Pr01et4!',
  server: '10.252.9.81',
  database: 'PhienHopChinhPhu',
  options: {}
};

var checkUser = function checkUser(val) {
  return new _bluebird2.default(function (resolve, reject) {
    _chat.User.findOneAsync({ userId: val.Id }).then(function (user) {
      if (user) {
        user.nickName = val.HoTen || "";
        if (val.AnhDaiDien) user.avatar = val.AnhDaiDien;
      } else {
        user = new _chat.User({
          userId: val.Id,
          nickName: val.HoTen || "",
          avatar: val.AnhDaiDien || null });
      }
      user.saveAsync().then(function (u) {
        resolve(u);
      });
    });
  });
};

exports.default = function () {
  return new _bluebird2.default(function (resolve, reject) {
    _mssql2.default.connect(config).then(function (pool) {
      return pool.request().query("select Id,TenHienThi as HoTen, AnhDaiDien from NguoiDungHeThong where TrangThai = 'active'");
    }).then(function (result) {
      console.dir(result);
      if (result.recordset && result.recordset.length > 0) {
        _bluebird2.default.each(result.recordset, function (val) {
          return checkUser(val).then(function (user) {});
        }).then(function (originalArray) {
          resolve(originalArray);
        }).catch(function (e) {
          console.log(e);reject(e);
        });
      }
    }).catch(function (err) {
      console.log(err);
    });

    _mssql2.default.on('error', function (err) {
      console.log('error', err);
    });
  });
};

module.exports = exports['default'];
//# sourceMappingURL=mssql.js.map
