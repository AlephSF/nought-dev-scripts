"use strict";

var _shelljs = require("shelljs");

exports.command = 'open';
exports.desc = 'Open the local DB in Sequel Pro';
exports.builder = {};

exports.handler = () => {
  (0, _shelljs.exec)('./node_modules/@aleph/nought-dev-scripts/bash/db-open.sh');
};