'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _PhanCapType = require('../types/PhanCapType');

var _chat = require('../../models/chat');

var _mongodb = require('mongodb');

var _graphql = require('graphql');

var phancap = {
  type: _PhanCapType.PhanCapType,
  resolve: function resolve() {
    return _chat.PhanCap.getLast({}).then(function (phancap) {
      return phancap;
    }).error(function (e) {});
  }
};

exports.default = phancap;
module.exports = exports['default'];
//# sourceMappingURL=phancap.js.map
