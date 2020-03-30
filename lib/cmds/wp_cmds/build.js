"use strict";

var _shelljs = require("shelljs");

exports.command = 'build';
exports.desc = 'Build the Dockerfile';
exports.builder = {
  buildArgs: {
    alias: 'a',
    "default": ['ACF_PRO_KEY=$ACF_PRO_KEY', 'PHP_ENV=dev']
  }
};

exports.handler = function (argv) {
  var projectName = (0, _shelljs.exec)("printf \"%s\" \"$(node -p \"require('./package.json').name\")\"", {
    silent: true
  }).stdout;
  var cmd;
  cmd = argv.buildSecrets !== false ? 'set -o allexport; source secrets/buildtime.secrets; set +o allexport && ' : '';
  cmd = "".concat(cmd, "docker build ");

  if (Array.isArray(argv.buildArgs)) {
    argv.buildArgs.forEach(function (buildArg) {
      cmd = "".concat(cmd, " --build-arg ").concat(buildArg, " ");
    });
  } else if (argv.buildArgs) {
    cmd = "".concat(cmd, " --build-arg ").concat(argv.buildArgs, " ");
  }

  cmd = "".concat(cmd, "-t ").concat(projectName, " ."); // eslint-disable-next-line no-unused-expressions

  (0, _shelljs.exec)(cmd).stdout;
};