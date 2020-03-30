import { exec } from 'shelljs';

exports.command = 'start';
exports.desc = 'Start the Docker stack';
exports.builder = {};
exports.handler = () => {
  // eslint-disable-next-line no-unused-expressions
  exec('yarn nds wp stop && docker-compose up').stdout;
};
