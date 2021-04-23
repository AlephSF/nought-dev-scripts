import { exec } from 'shelljs';

exports.command = 'dump';
exports.desc = 'Export a dump of the local MySQL database';
exports.builder = {};
exports.handler = () => {
  exec('docker-compose exec -T db /usr/bin/mysqldump -u wordpress --password=wordpress wordpress > dumps/local_dump.sql && gzip -f dumps/local_dump.sql');
};
