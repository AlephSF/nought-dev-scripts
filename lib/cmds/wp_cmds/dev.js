"use strict";

var _shelljs = require("shelljs");

exports.command = 'dev';
exports.desc = 'Rebuild and start the Docker stack';
exports.builder = {};

exports.handler = function () {
  // eslint-disable-next-line no-unused-expressions
  (0, _shelljs.exec)('yarn nds wp build && yarn nds wp start --force-recreate --remove-orphans --abort-on-container-exit').stdout;
};