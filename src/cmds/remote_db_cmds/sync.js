/* eslint-disable max-len */
import { exec } from 'shelljs';
import { google } from 'googleapis';
import { auth } from 'google-auth-library';
import { Storage } from '@google-cloud/storage';
import replaceStream from 'replacestream';
import zlib from 'zlib';
import fs from 'fs';
import path from 'path';

const sqladmin = google.sql('v1beta4');

exports.command = 'sync [target]';
exports.desc = 'Import the latest dump to a target DB';
exports.builder = (yargs) => {
  yargs.positional('target', {
    describe: 'Target environment',
    type: 'string',
    default: 'wordpress',
  })
    .option('source-environment', {
      alias: 'e',
      default: 'production',
    })
    .option('bucket', {
      alias: 'b',
    })
    .option('project', {
      alias: 'p',
    })
    .option('instance', {
      alias: 'i',
    });
};

exports.handler = (argv) => {
  const repoName = exec("printf \"%s\" \"$(node -p \"require('./package.json').name\")\"", { silent: true }).stdout;
  const bucket = argv.bucket ? argv.bucket : exec("printf \"%s\" \"$(node -p \"require('./package.json').config.dbBucketName\")\"", { silent: true }).stdout;
  const instance = argv.instance ? argv.instance : exec("printf \"%s\" \"$(node -p \"require('./package.json').config.dbSandboxInstanceName\")\"", { silent: true }).stdout;
  const project = argv.project ? argv.project : exec("printf \"%s\" \"$(node -p \"require('./package.json').config.gcpProjectName\")\"", { silent: true }).stdout;

  if (!bucket || bucket === 'undefined' || !instance || instance === 'undefined' || !project || project === 'undefined') {
    console.log('Export not attempted, information missing. Did you set up your GCP defaults in the package.json config?');
    return;
  }

  const { e, target } = argv;
  const sourceDatabase = `${repoName}-${e}`;
  const targetDatabase = target === 'wordpress' ? 'wordpress' : `${repoName}-${target}`;

  const srcFilename = `sync-${sourceDatabase}.sql.gz`;
  const srcFilenameUnzipped = path.join('./dumps/', `sync-${targetDatabase}.sql`);
  const srcFilenameReplaced = path.join('./dumps/', 'find-replaced.sql');
  const destFilename = path.join('./dumps/', targetDatabase === 'wordpress' ? 'local_dump.sql.gz' : `sync-${targetDatabase}.sql.gz`);

  const storage = new Storage();

  async function syncIt() {
    const options = {
      destination: destFilename,
    };
    console.log(`Downloading MySQL dump from ${sourceDatabase}`);

    await storage
      .bucket(bucket)
      .file(srcFilename)
      .download(options);

    console.log(`gs://${bucket}/${srcFilename} downloaded to ${destFilename}, now uncompressing...`);
    const unzipped = new Promise((resolve, reject) => {
      const zippedContents = fs.createReadStream(destFilename);
      const unzippedContents = fs.createWriteStream(srcFilenameUnzipped);
      const unzip = zlib.createGunzip();

      // eslint-disable-next-line consistent-return
      zippedContents.pipe(unzip).pipe(unzippedContents).on('finish', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    await unzipped;
    console.log(`DB Dump Unzipped to ${srcFilenameUnzipped}, running find-replace...`);

    const replaced = new Promise((resolve, reject) => {
      fs.createReadStream(srcFilenameUnzipped)
        .pipe(replaceStream(sourceDatabase, targetDatabase))
        .pipe(fs.createWriteStream(srcFilenameReplaced))
        // eslint-disable-next-line consistent-return
        .on('finish', (err) => {
          if (err) return reject(err);
          resolve();
        });
    });

    await replaced;
    console.log('Ran find-replace, now re-compressing...');

    fs.unlink(srcFilenameUnzipped, () => {});

    const rezipped = new Promise((resolve, reject) => {
      const toZipContents = fs.createReadStream(srcFilenameReplaced);
      const rezippedContents = fs.createWriteStream(destFilename);
      const rezip = zlib.createGzip();

      // eslint-disable-next-line consistent-return
      toZipContents.pipe(rezip).pipe(rezippedContents).on('finish', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    await rezipped;
    console.log(`DB Dump re-zipped to ${destFilename}!`);

    fs.unlink(srcFilenameReplaced, () => {});

    if (targetDatabase === 'wordpress') {
      return;
    }

    try {
      const storageOptions = { resumable: false };
      const uploadResults = await storage.bucket(bucket).upload(destFilename, storageOptions);
      console.log(`${destFilename} uploaded to ${bucket}.`, uploadResults);
    } catch (error) {
      console.error('Error occurred while uploading:', error);
    }

    const authRes = await auth.getApplicationDefault();
    const authClient = authRes.credential;

    const request = {
      project,
      instance,
      resource: {
        importContext: {
          kind: 'sql#importContext',
          fileType: 'SQL',
          uri: `gs://${bucket}/sync-${targetDatabase}.sql.gz`,
          databases: [targetDatabase],
        },
      },
      auth: authClient,
    };

    try {
      const importResults = await sqladmin.instances.import(request);
      console.log(`${destFilename} uploaded to ${bucket}.`, importResults);
      fs.unlink(destFilename, () => {});
    } catch (error) {
      console.error('Error occurred while importing:', error);
    }
  }
  syncIt();
};
