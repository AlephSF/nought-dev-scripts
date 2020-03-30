"use strict";

var _shelljs = _interopRequireDefault(require("shelljs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports.command = 'build <type>';
exports.desc = 'Build the Dockerfile';
exports.builder = {
  buildArgs: {
    alias: 'a',
    "default": 'ACF_PRO_KEY=$ACF_PRO_KEY'
  }
};

exports.handler = function (argv) {
  var projectName = _shelljs["default"].exec("printf \"%s\" \"$(node -p \"require('./package.json').name\")\"", {
    silent: true
  }).stdout;

  var cmd;

  if (argv.type === 'wp') {
    cmd = argv.buildSecrets !== false ? 'set -o allexport; source secrets/buildtime.secrets; set +o allexport && ' : '';
    cmd = "".concat(cmd, "docker build ");
    cmd = "".concat(cmd, " --build-arg ACF_PRO_KEY=$ACF_PRO_KEY ");
    cmd = "".concat(cmd, "-t ").concat(projectName, " .");
  } // eslint-disable-next-line no-unused-expressions


  _shelljs["default"].exec(cmd).stdout;
};