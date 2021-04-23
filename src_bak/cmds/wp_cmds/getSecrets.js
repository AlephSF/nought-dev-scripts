import { exec } from 'shelljs';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

exports.command = 'get-secrets [secret-version] [secret-name]';
exports.desc = 'Gets secrets needed for local development, stores as a .env file.';
exports.builder = {
  'secret-version': {
    alias: 'v',
    default: 'latest',
  },
  'secret-name': {
    alias: 'n',
    default: 'wp-dev-secrets',
  },
};

exports.handler = (argv) => {
  const gcpProject = exec("printf \"%s\" \"$(node -p \"require('./package.json').config.gcpProjectName\")\"", { silent: true }).stdout;
  const secretName = `projects/${gcpProject}/secrets/${argv['secret-name']}/versions/${argv['secret-version']}`;
  const client = new SecretManagerServiceClient();
  async function getSecretVersion() {
    const [secretMeta] = await client.getSecretVersion({
      name: secretName,
    });
    console.info(`Found secret ${secretMeta.name} with state ${secretMeta.state}.`);

    const [version] = await client.accessSecretVersion({
      name: secretName,
    });

    const payload = version.payload.data.toString('utf8');

    exec(`echo "${payload}" > .env`);

    console.log('Secret stored as .env. Please do NOT commit this file to Git!');
  }
  getSecretVersion();
};
