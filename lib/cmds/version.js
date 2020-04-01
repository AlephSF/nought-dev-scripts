"use strict";

var _shelljs = require("shelljs");

exports.command = 'version';
exports.desc = 'Automatically generate a semantic version from the latest on master';
exports.builder = {};

exports.handler = () => {
  // eslint-disable-next-line no-unused-expressions
  (0, _shelljs.exec)('git checkout master && git pull origin master && standard-version').stdout;
};