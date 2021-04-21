import { exec } from 'child_process';

exports.command = 'cli [command]';
exports.desc = 'Run a WP-CLI command in the local Docker container';
exports.builder = {
  command: {
    alias: 'c',
    default: '--info',
  },
};
exports.handler = (argv) => {
  exec(`docker-compose exec -T wordpress wp --allow-root ${argv.command}`, { stdio: 'inherit' }, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);
  });
};
