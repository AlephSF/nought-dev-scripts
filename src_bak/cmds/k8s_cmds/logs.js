import { exec } from 'shelljs';

exports.command = 'logs [environment]';
exports.desc = 'View the latest logs for this deployment in Kubernetes';
exports.builder = {
  environment: {
    alias: 'e',
    default: 'production',
  },
};
exports.handler = (argv) => {
  const projectName = exec("printf \"%s\" \"$(node -p \"require('./package.json').name\")\"", { silent: true }).stdout;
  exec(`kubectl logs -f deployment/${projectName}-deployment-${argv.environment} --all-containers=true --since=10m`);
};
