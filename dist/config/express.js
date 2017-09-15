'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mysql = require('./mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _cors3 = require('./cors');

var corsOption = _interopRequireWildcard(_cors3);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongodb = require('mongodb');

var _env = require('./env');

var _env2 = _interopRequireDefault(_env);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chat = require('../server/models/chat');

var _constant = require('../server/common/constant');

var _util = require('../server/common/util');

var _variable = require('../server/common/variable');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// parse body params and attache them to req.body
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));

app.use(_express2.default.static('dist/public'));

// secure apps by setting various HTTP headers
app.use((0, _helmet2.default)());
app.use((0, _cors2.default)());
app.get('/', function (req, res) {
  res.sendfile('dist/public/index.html');
});

var upload = (0, _multer2.default)({ dest: _path2.default.join(__dirname, '../public/uploads/') }).any('recfiles');

app.post('/api/upload', upload, function (req, res) {
  var _loop = function _loop(i) {
    var file = new _chat.File({
      fileName: req.files[i].originalname,
      fileType: req.files[i].mimetype,
      path: req.files[i].path,
      creater: (0, _mongodb.ObjectID)(req.body.from)
    });
    file.saveAsync().then(function (file) {
      var message = new _chat.Message({
        from: req.body ? (0, _mongodb.ObjectID)(req.body.from) : undefined,
        toGroup: req.body.toGroup ? (0, _mongodb.ObjectID)(req.body.toGroup) : undefined,
        toUser: req.body.toUser ? (0, _mongodb.ObjectID)(req.body.toUser) : undefined,
        content: "<a href=\"/download/" + file.id + "\" class=\"fileattach\"><i class=\"fa " + (0, _util.getFileTypeFA)(file.fileType) + " fa-3x\"></i>" + file.fileName + "</a>",
        state: 0,
        time: new Date().getTime()
      });
      message.saveAsync().then(function (message) {
        var type = "user";
        if (message.toUser) {
          _variable.socker.forEach(function (sk) {
            if (sk.userId == message.toUser || sk.userId == message.from) {
              sk.emit(_constant.SOCKET_GET_MESSAGE, message, req.body.temp[i]);
            }
          });
          _chat.User.findOneAsync({ _id: (0, _mongodb.ObjectID)(message.toUser) }).then(function (user) {
            user.recent = (0, _util.updateRecent)(user.recent, message.from.toString());
            user.saveAsync();
          });
        }
        if (message.toGroup) {
          // gui tin nhan den cac thanh vien trong group dang online.
          type = "group";
          _chat.Group.findOneAsync({ _id: (0, _mongodb.ObjectID)(message.toGroup) }).then(function (group) {
            _variable.socker.forEach(function (sk) {
              if (group.member.indexOf(sk.userId) != -1) {
                sk.emit(_constant.SOCKET_GET_MESSAGE, message, req.body.temp[i]);
              }
            });
            var idsIn = _lodash2.default.flatMap(group.member, function (m) {
              return (0, _mongodb.ObjectID)(m);
            });
            _chat.User.findAsync({ _id: { $in: idsIn } }).then(function (users) {
              users.forEach(function (user) {
                user.recent = (0, _util.updateRecent)(user.recent, message.toGroup.toString(), "group");
                user.saveAsync();
              });
            });
          });
        }
        _chat.User.findOneAsync({ _id: (0, _mongodb.ObjectID)(message.from) }).then(function (user) {
          if (!user.recent) {
            user.recent = [];
          }
          var rid = message.toGroup || message.toUser;
          var ii = _lodash2.default.findIndex(user.recent, { id: rid });
          if (ii == -1) user.recent.push({ id: rid, last: new Date().getTime(), type: type });
          user.saveAsync();
        });
      });
    });
  };

  for (var i = 0; i < req.files.length; i++) {
    _loop(i);
  };
  res.end();
});

app.get('/download/:idfile', function (req, res) {
  _chat.File.get(req.params.idfile).then(function (file) {
    res.download(file.path, file.fileName);
  }).error(function (e) {});
});

app.post('/api/capnhatmysql', function (req, res) {
  (0, _mysql2.default)().then(function (result) {
    res.send(result);
  });
});
app.get('/api/capnhatmysql', function (req, res) {
  (0, _mysql2.default)().then(function (result) {
    res.send(result);
  });
});

exports.default = app;
module.exports = exports['default'];
//# sourceMappingURL=express.js.map
