"use strict";

var _child_process = require("child_process");

exports.command = 'shell';
exports.desc = 'Shell into local WordPress Docker container';
exports.builder = {};

exports.handler = function () {
  (0, _child_process.spawn)('docker-compose exec wordpress bash', {
    stdio: 'inherit',
    shell: true
  });
};