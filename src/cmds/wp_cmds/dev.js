import { exec } from 'shelljs';

exports.command = 'dev';
exports.desc = 'Rebuild and start the Docker stack';
exports.builder = {};

exports.handler = () => {
  exec('yarn nds wp build && yarn nds wp start --force-recreate --remove-orphans --abort-on-container-exit').stdout;
};
