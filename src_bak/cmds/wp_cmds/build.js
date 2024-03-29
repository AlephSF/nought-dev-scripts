import { exec } from 'shelljs';
import fs from 'fs';

exports.command = 'build';
exports.desc = 'Build the Dockerfile';
exports.builder = {
  buildArgs: {
    alias: 'a',
    default: ['ACF_PRO_KEY=$ACF_PRO_KEY', 'PHP_ENV=dev'],
  },
};
exports.handler = (argv) => {
  const projectName = exec("printf \"%s\" \"$(node -p \"require('./package.json').name\")\"", { silent: true }).stdout;
  let cmd;
  cmd = argv.buildSecrets !== false && fs.existsSync('.env') ? 'set -o allexport; source .env; set +o allexport && ' : '';
  cmd = `${cmd}docker build `;
  if (Array.isArray(argv.buildArgs)) {
    argv.buildArgs.forEach((buildArg) => {
      cmd = `${cmd} --build-arg ${buildArg} `;
    });
  } else if (argv.buildArgs) {
    cmd = `${cmd} --build-arg ${argv.buildArgs} `;
  }
  cmd = `${cmd}-t ${projectName} .`;
  exec(cmd).stdout;
};
