#!/usr/bin/env node
"use strict";

var _yargs = _interopRequireDefault(require("yargs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// eslint-disable-next-line no-unused-expressions
_yargs["default"].commandDir('cmds').demandCommand().help().argv;