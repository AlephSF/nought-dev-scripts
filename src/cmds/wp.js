exports.command = 'wp <command>';
exports.desc = 'WordPress dev commands';
exports.builder = (yargs) => yargs.commandDir('wp_cmds');
// eslint-disable-next-line no-unused-vars
exports.handler = (argv) => {};
