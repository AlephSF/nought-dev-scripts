"use strict";

exports.command = 'wp <command>';
exports.desc = 'WordPress dev commands';

exports.builder = function (yargs) {
  return yargs.commandDir('wp_cmds');
}; // eslint-disable-next-line no-unused-vars


exports.handler = function (argv) {};