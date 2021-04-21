import { exec } from 'shelljs';

exports.command = 'dev';
exports.desc = 'Rebuild and start the Docker stack';
exports.builder = {};

exports.handler = () => {
  exec('nds wp build && nds wp start --force-recreate --remove-orphans --abort-on-container-exit').stdout;
};
