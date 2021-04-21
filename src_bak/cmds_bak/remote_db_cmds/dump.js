/* eslint-disable max-len */
import { exec } from 'shelljs';
import { google } from 'googleapis';
import { auth } from 'google-auth-library';

const sqladmin = google.sql('v1beta4');

exports.command = 'dump';
exports.desc = 'Export a dump of a remote MySQL database';
exports.builder = {
  environment: {
    alias: 'e',
    default: 'production',
  },
  bucket: {
    alias: 'b',
  },
  project: {
    alias: 'p',
  },
  instance: {
    alias: 'i',
  },
};
exports.handler = (argv) => {
  const repoName = exec("printf \"%s\" \"$(node -p \"require('./package.json').name\")\"", { silent: true }).stdout;
  const bucket = argv.bucket ? argv.bucket : exec("printf \"%s\" \"$(node -p \"require('./package.json').config.dbBucketName\")\"", { silent: true }).stdout;
  const instance = argv.instance ? argv.instance : exec("printf \"%s\" \"$(node -p \"require('./package.json').config.dbProdInstanceName\")\"", { silent: true }).stdout;
  const project = argv.project ? argv.project : exec("printf \"%s\" \"$(node -p \"require('./package.json').config.gcpProjectName\")\"", { silent: true }).stdout;

  if (!bucket || bucket === 'undefined' || !instance || instance === 'undefined' || !project || project === 'undefined') {
    console.log('Dump not attempted, information missing. Did you set up your GCP defaults in the package.json config?');
    return;
  }

  const { environment } = argv;
  const sourceDatabase = `${repoName}-${environment}`;

  async function dumpIt() {
    const authRes = await auth.getApplicationDefault();
    const authClient = authRes.credential;
    const request = {
      project,
      instance,
      resource: {
        exportContext: {
          kind: 'sql#exportContext',
          fileType: 'SQL',
          uri: `gs://${bucket}/sync-${sourceDatabase}.sql.gz`,
          databases: [sourceDatabase],
        },
      },
      auth: authClient,
    };
    console.log('started');
    sqladmin.instances.export(request, (err, result) => {
      if (err) {
        console.log(err);
        console.log('Export failed');
      } else {
        console.log(result);
        console.log('Export started, please wait 10 minutes for the latest export to appear in the GCS bucket!');
      }
    });
  }
  dumpIt();
};
