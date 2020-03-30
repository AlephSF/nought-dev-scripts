"use strict";

var _shelljs = require("shelljs");

var _semverCompare = _interopRequireDefault(require("semver-compare"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports.command = 'theme-build [directory]';
exports.desc = 'Build the WordPress theme';
exports.builder = {
  type: {
    alias: 't',
    "default": 'sage'
  }
};

exports.handler = function (argv) {
  // eslint-disable-next-line max-len
  // const themeName = exec(`printf "%s" "$(node -p "require('./web/app/themes/${argv.directory}/package.json').name")"`, { silent: true }).stdout;
  var themeVersion = (0, _shelljs.exec)("printf \"%s\" \"$(node -p \"require('./web/app/themes/".concat(argv.directory, "/package.json').version\")\""), {
    silent: true
  }).stdout;
  var cmd = "cd web/app/themes/".concat(argv.directory); // Sage 9

  if ((0, _semverCompare["default"])(themeVersion, '9.0.0') !== -1 && argv.type === 'sage') {
    cmd = "".concat(cmd, " && yarn && yarn build");
    cmd = argv.production ? "".concat(cmd, ":production") : cmd;
    cmd = argv.watch ? "".concat(cmd, " && yarn start") : cmd;
  } // eslint-disable-next-line no-unused-expressions


  (0, _shelljs.exec)(cmd).stdout;
};