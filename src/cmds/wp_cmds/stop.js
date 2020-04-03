import { exec } from 'shelljs';

exports.command = 'stop';
exports.desc = 'Stop the Docker stack';
exports.builder = {};
exports.handler = () => {
  exec('docker-compose down').stdout;
};
