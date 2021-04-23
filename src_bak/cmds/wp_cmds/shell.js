import { spawn } from 'child_process';

exports.command = 'shell';
exports.desc = 'Shell into local WordPress Docker container';
exports.builder = {};
exports.handler = () => {
  spawn('docker-compose exec wordpress bash', { stdio: 'inherit', shell: true });
};
