"use strict";

var _shelljs = require("shelljs");

exports.command = 'release';
exports.desc = 'Push a versioned release';
exports.builder = {};

exports.handler = argv => {
  var cmd = 'git push --follow-tags origin master';
  cmd = argv.npm ? "".concat(cmd, " && npm publish") : cmd; // eslint-disable-next-line no-unused-expressions

  (0, _shelljs.exec)(cmd).stdout;
};