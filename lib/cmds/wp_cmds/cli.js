"use strict";

var _child_process = require("child_process");

exports.command = 'cli [command]';
exports.desc = 'Run a WP-CLI command in the local Docker container';
exports.builder = {
  command: {
    alias: 'c',
    default: '--info'
  }
};

exports.handler = argv => {
  // eslint-disable-next-line no-unused-expressions
  (0, _child_process.exec)("docker-compose exec -T wordpress wp --allow-root ".concat(argv.command), {
    stdio: 'inherit'
  }, (error, stdout, stderr) => {
    if (error) {
      console.error("exec error: ".concat(error));
      return;
    }

    console.log(stdout);
    console.error(stderr);
  });
};