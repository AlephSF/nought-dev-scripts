import { exec } from 'child_process';

exports.command = 'find-replace <source-url>';
exports.desc = 'Use the WP CLI to find-replace urls in your local DB';
exports.builder = {
  'local-url': {
    alias: 'l',
    default: 'http://localhost:8080',
  },
};
exports.handler = (argv) => {
  exec(`docker-compose exec -T wordpress wp --allow-root search-replace '${argv['source-url']}' '${argv['local-url']}' --recurse-objects --skip-columns=guid --skip-tables=wp_users`, { stdio: 'inherit' }, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);
  });
};
