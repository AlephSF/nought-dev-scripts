import { exec } from 'shelljs';

exports.command = 'restore';
exports.desc = 'Import a dump to the local MySQL database';
exports.builder = {
  file: {
    alias: 'f',
    default: 'dumps/local_dump.sql.gz',
  },
};
exports.handler = (argv) => {
  exec(`cat ${argv.file} | zcat | docker-compose exec -T db /usr/bin/mysql -u wordpress --password=wordpress wordpress`);
};
 