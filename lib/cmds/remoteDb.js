"use strict";

exports.command = 'remote-db <command>';
exports.desc = 'Remote database operations';

exports.builder = yargs => yargs.commandDir('remote_db_cmds'); // eslint-disable-next-line no-unused-vars


exports.handler = argv => {};