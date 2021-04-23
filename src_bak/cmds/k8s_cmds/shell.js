import { spawn } from 'child_process';
import { exec } from 'shelljs';

exports.command = 'shell [environment]';
exports.desc = 'Shell into one of the pods within this deployment in Kubernetes';
exports.builder = {
  environment: {
    alias: 'e',
    default: 'production',
  },
};
exports.handler = (argv) => {
  const projectName = exec("printf \"%s\" \"$(node -p \"require('./package.json').name\")\"", { silent: true }).stdout;
  const podName = exec(`kubectl get pod -l app=${projectName}-${argv.environment} -o jsonpath="{.items[0].metadata.name}"`, { silent: true }).stdout;
  if (!podName) {
    console.log(`Sorry, I couldn't find a pod in that cluster and the ${argv.environment} environment. Are you using the right k8s context?`);
    return;
  }
  spawn(`kubectl exec -it ${podName} bash`, { stdio: 'inherit', shell: true });
};
