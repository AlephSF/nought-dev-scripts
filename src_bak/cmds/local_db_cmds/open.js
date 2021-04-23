import { exec } from 'shelljs';

exports.command = 'open';
exports.desc = 'Open the local DB in Sequel Pro';
exports.builder = {};
exports.handler = () => {
  exec('./node_modules/@aleph/nought-dev-scripts/bash/db-open.sh');
};
