"use strict";

var _shelljs = require("shelljs");

exports.command = 'start';
exports.desc = 'Start the Docker stack';
exports.builder = {};

exports.handler = function () {
  // eslint-disable-next-line no-unused-expressions
  (0, _shelljs.exec)('yarn nds wp stop && docker-compose up').stdout;
};