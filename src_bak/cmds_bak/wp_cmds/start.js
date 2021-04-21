import { exec } from 'shelljs';

exports.command = 'start';
exports.desc = 'Start the Docker stack';
exports.builder = {};
exports.handler = () => {
  exec('yarn nds wp stop && docker-compose up').stdout;
};
