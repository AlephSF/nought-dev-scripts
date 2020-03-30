import { exec } from 'shelljs';

exports.command = 'stop';
exports.desc = 'Stop the Docker stack';
exports.builder = {};
exports.handler = () => {
  // eslint-disable-next-line no-unused-expressions
  exec('docker-compose down').stdout;
};
