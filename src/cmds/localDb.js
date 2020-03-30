exports.command = 'localDb <command>';
exports.desc = 'Local database operations';
exports.builder = (yargs) => yargs.commandDir('local_db_cmds');
// eslint-disable-next-line no-unused-vars
exports.handler = (argv) => {};
