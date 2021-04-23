import { exec } from 'shelljs';

exports.command = 'release';
exports.desc = 'Push a versioned release';
exports.builder = {};

exports.handler = (argv) => {
  let cmd = 'git push --follow-tags origin master';
  cmd = argv.npm ? `${cmd} && npm publish` : cmd;
  exec(cmd).stdout;
};
