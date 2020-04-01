import { exec } from 'shelljs';
import cmp from 'semver-compare';

exports.command = 'theme-build [directory]';
exports.desc = 'Build the WordPress theme';
exports.builder = {
  type: {
    alias: 't',
    default: 'sage',
  },
};
exports.handler = (argv) => {
  // eslint-disable-next-line max-len
  // const themeName = exec(`printf "%s" "$(node -p "require('./web/app/themes/${argv.directory}/package.json').name")"`, { silent: true }).stdout;
  const themeVersion = exec(`printf "%s" "$(node -p "require('./web/app/themes/${argv.directory}/package.json').version")"`, { silent: true }).stdout;

  let cmd = `cd web/app/themes/${argv.directory}`;
  // Sage 9
  if (cmp(themeVersion, '9.0.0') !== -1 && argv.type === 'sage') {
    cmd = argv.composer ? `${cmd} && composer install` : '';
    cmd = `${cmd} && yarn && yarn build`;
    cmd = argv.production ? `${cmd}:production` : cmd;
    cmd = argv.watch ? `${cmd} && yarn start` : cmd;
  }

  // eslint-disable-next-line no-unused-expressions
  exec(cmd).stdout;
};
