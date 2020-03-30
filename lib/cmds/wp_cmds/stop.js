"use strict";

var _shelljs = require("shelljs");

exports.command = 'stop';
exports.desc = 'Stop the Docker stack';
exports.builder = {};

exports.handler = function () {
  // eslint-disable-next-line no-unused-expressions
  (0, _shelljs.exec)('docker-compose down').stdout;
};