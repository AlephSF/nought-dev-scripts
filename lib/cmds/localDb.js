"use strict";

exports.command = 'localDb <command>';
exports.desc = 'Local database operations';

exports.builder = function (yargs) {
  return yargs.commandDir('local_db_cmds');
}; // eslint-disable-next-line no-unused-vars


exports.handler = function (argv) {};