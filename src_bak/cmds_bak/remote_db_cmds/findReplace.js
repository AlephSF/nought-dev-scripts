// import { exec } from 'child_process';
import { exec } from 'shelljs';

exports.command = 'find-replace <env> <find> <replace>';
exports.desc = 'Use the WP CLI to find-replace strings in your local DB';
exports.builder = {};
exports.handler = (argv) => {
  if (argv.env === 'production') {
    console.log('Please refrain from using this on the production environment! Exiting...');
    return;
  }
  const projectName = exec("printf \"%s\" \"$(node -p \"require('./package.json').name\")\"", { silent: true }).stdout;
  const podName = exec(`kubectl get pod -l app=${projectName}-${argv.env} -o jsonpath="{.items[0].metadata.name}"`).stdout;

  exec(`kubectl exec ${podName} wp -- --allow-root search-replace '${argv.find}' '${argv.replace}' --recurse-objects`, { silent: true, stdio: 'inherit' }, (error, stdout) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(stdout);
  });
};
