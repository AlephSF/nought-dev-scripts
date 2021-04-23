exports.command = 'k8s <command>';
exports.desc = 'Kubernetes helper commands';
exports.builder = (yargs) => yargs.commandDir('k8s_cmds');
// eslint-disable-next-line no-unused-vars
exports.handler = (argv) => {};
