import { exec } from 'shelljs';

exports.command = 'version';
exports.desc = 'Automatically generate a semantic version from the latest on master';
exports.builder = {};

exports.handler = () => {
  // eslint-disable-next-line no-unused-expressions
  exec('git checkout master && git pull origin master && standard-version').stdout;
};
