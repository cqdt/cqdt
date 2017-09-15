'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logins = exports.login = exports.userById = exports.user = exports.users = undefined;

var _OutputType = require('../types/OutputType');

var _chat = require('../../models/chat');

var _graphql = require('graphql');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _variable = require('../../common/variable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// var locdau = (t,f) {
var vn = ["aeouidy", "áàạảãâấầậẩẫăắằặẳẵÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ", "éèẹẻẽêếềệểễÉÈẸẺẼÊẾỀỆỂỄ", "óòọỏõôốồộổỗơớờợởỡÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ", "úùụủũưứừựửữÚÙỤỦŨƯỨỪỰỬỮ", "íìịỉĩÍÌỊỈĨ", "đĐ", "ýỳỵỷỹÝỲỴỶỸ"];
var locdau = function locdau(str) {
  for (var i = 1; i < vn.length; i++) {
    for (var j = 0; j < vn[i].length; j++) {
      str = str.replace(vn[i][j], vn[0][i - 1]);
    }
  }
  return str.toLowerCase();
};
//     if(locdau(t).indexOf(locdau(f)) != -1)
//     return true;
// }

var compareText = function compareText(a, b) {

  if (_variable.userOnline.indexOf(b._id) != -1 && _variable.userOnline.indexOf(a._id) == -1) {
    return true;
  } else if (_variable.userOnline.indexOf(b._id) == -1 && _variable.userOnline.indexOf(a._id) != -1) {
    return false;
  } else {
    var na = locdau(a.nickName),
        nb = locdau(b.nickName);
    if (_lodash2.default.last(na.split(' ')) < _lodash2.default.last(nb.split(' '))) {
      return true;
    } else if (_lodash2.default.last(na.split(' ')) === _lodash2.default.last(nb.split(' '))) {
      if (na < nb) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
};

var sortUser = function sortUser(us) {
  // console.log(locdau("Nguyễn Đức Hải"),locdau("Nguyễn Thanh Hải"),compareText(locdau("Nguyễn Đức Hải"),locdau("Nguyễn Thanh Hải")));
  var a = us.sort(function (a, b) {
    if (compareText(a, b)) return -1;
    return 1;
  });
  // console.log(us);
  return us;
};

var users = exports.users = {
  type: new _graphql.GraphQLList(_OutputType.UserType),
  args: {
    q: {
      type: _graphql.GraphQLString
    }
  },
  resolve: function resolve(_, _ref) {
    var q = _ref.q;

    var options = JSON.parse(q);
    return _chat.User.list(options).then(function (users) {
      return sortUser(users);
    }).error(function (e) {});
  }
};

var user = exports.user = {
  type: _OutputType.UserType,
  args: {
    q: {
      type: _graphql.GraphQLString
    }
  },
  resolve: function resolve(_, _ref2) {
    var q = _ref2.q;

    return _chat.User.findOneAsync({ userId: q }).then(function (user) {
      return user;
    }).error(function (e) {});
  }
};

var userById = exports.userById = {
  type: _OutputType.UserType,
  args: {
    q: {
      type: _graphql.GraphQLString
    }
  },
  resolve: function resolve(_, _ref3) {
    var q = _ref3.q;

    return _chat.User.get(q).then(function (user) {
      return user;
    }).error(function (e) {});
  }
};

var login = exports.login = {
  type: _graphql.GraphQLFloat,
  args: {
    u: {
      type: _graphql.GraphQLString
    },
    m: {
      type: _graphql.GraphQLString
    },
    y: {
      type: _graphql.GraphQLString
    }
  },
  resolve: function resolve(_, _ref4) {
    var u = _ref4.u,
        m = _ref4.m,
        y = _ref4.y;

    return _chat.User.findOneAsync({ userId: u }).then(function (user) {
      var month = m;
      var year = y;
      var result = 0;
      if (user) {
        if (year === "all" || year === '' || year === 'undefined') {
          for (var j = 0; j < user.login.length; j++) {
            result += user.login[j];
          }
        } else {
          if (month === "all" || month === '' || month === 'undefined') {
            var fD = new Date(user.first);
            if (fD.getFullYear <= year) {
              var index = monthdiff(user.first, new Date(year, 12, 1).getTime());
              for (var _j = index; _j > 0; _j--) {
                var k = 0;
                if (k < 12 && typeof user.login[_j] !== 'undefined') result += user.login[_j];
                k++;
              }
            }
          } else {
            var _index = monthdiff(user.first, new Date(year, month, 1).getTime());
            if (typeof user.login[_index] !== 'undefined') result = user.login[_index];
          }
        }
      }
      return result;
    }).error(function (e) {
      console.log(e);return 0;
    });
  }
};

var logins = exports.logins = {
  type: new _graphql.GraphQLList(_OutputType.LoginType),
  args: {
    u: {
      type: new _graphql.GraphQLList(_graphql.GraphQLString)
    },
    m: {
      type: _graphql.GraphQLString
    },
    y: {
      type: _graphql.GraphQLString
    }
  },
  resolve: function resolve(_, _ref5) {
    var u = _ref5.u,
        m = _ref5.m,
        y = _ref5.y;

    return _chat.User.findAsync({ userId: { $in: u } }).then(function (users) {
      var month = m;
      var year = y;
      var result = [];
      if (users) {
        users.forEach(function (user) {
          var ur = { username: user.userId, login: 0 };
          if (year === "all" || year === '' || year === 'undefined') {
            for (var j = 0; j < user.login.length; j++) {
              ur.login += user.login[j];
            }
          } else {
            if (month === "all" || month === '' || month === 'undefined') {
              var fD = new Date(user.first);
              if (fD.getFullYear <= year) {
                var index = monthdiff(user.first, new Date(year, 12, 1).getTime());
                for (var _j2 = index; _j2 > 0; _j2--) {
                  var k = 0;
                  if (k < 12 && typeof user.login[_j2] !== 'undefined') ur.login += user.login[_j2];
                  k++;
                }
              }
            } else {
              var _index2 = monthdiff(user.first, new Date(year, month, 1).getTime());
              if (typeof user.login[_index2] !== 'undefined') ur.login = user.login[_index2];
            }
          }
          result.push(ur);
        });
        var ar = result.chunk(150);
        return result;
      }
    }).error(function (e) {
      console.log(e);return [];
    });
  }
};
//# sourceMappingURL=user.js.map
