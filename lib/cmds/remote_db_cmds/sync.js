"use strict";

var _shelljs = require("shelljs");

var _googleapis = require("googleapis");

var _googleAuthLibrary = require("google-auth-library");

var _storage = require("@google-cloud/storage");

var _replacestream = _interopRequireDefault(require("replacestream"));

var _zlib = _interopRequireDefault(require("zlib"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var sqladmin = _googleapis.google.sql('v1beta4');

exports.command = 'sync [target]';
exports.desc = 'Import the latest dump to a target DB';

exports.builder = yargs => {
  yargs.positional('target', {
    describe: 'Target environment',
    type: 'string',
    default: 'wordpress'
  }).option('source-environment', {
    alias: 'e',
    default: 'production'
  }).option('bucket', {
    alias: 'b'
  }).option('project', {
    alias: 'p'
  }).option('instance', {
    alias: 'i'
  });
};

exports.handler = argv => {
  var repoName = (0, _shelljs.exec)("printf \"%s\" \"$(node -p \"require('./package.json').name\")\"", {
    silent: true
  }).stdout;
  var bucket = argv.bucket ? argv.bucket : (0, _shelljs.exec)("printf \"%s\" \"$(node -p \"require('./package.json').config.dbBucketName\")\"", {
    silent: true
  }).stdout;
  var instance = argv.instance ? argv.instance : (0, _shelljs.exec)("printf \"%s\" \"$(node -p \"require('./package.json').config.dbSandboxInstanceName\")\"", {
    silent: true
  }).stdout;
  var project = argv.project ? argv.project : (0, _shelljs.exec)("printf \"%s\" \"$(node -p \"require('./package.json').config.gcpProjectName\")\"", {
    silent: true
  }).stdout;

  if (!bucket || bucket === 'undefined' || !instance || instance === 'undefined' || !project || project === 'undefined') {
    console.log('Export not attempted, information missing. Did you set up your GCP defaults in the package.json config?');
    return;
  }

  var {
    e,
    target
  } = argv;
  var sourceDatabase = "".concat(repoName, "-").concat(e);
  var targetDatabase = target === 'wordpress' ? 'wordpress' : "".concat(repoName, "-").concat(target);
  var srcFilename = "sync-".concat(sourceDatabase, ".sql.gz");

  var srcFilenameUnzipped = _path.default.join('./dumps/', "sync-".concat(targetDatabase, ".sql"));

  var srcFilenameReplaced = _path.default.join('./dumps/', 'find-replaced.sql');

  var destFilename = _path.default.join('./dumps/', targetDatabase === 'wordpress' ? 'local_dump.sql.gz' : "sync-".concat(targetDatabase, ".sql.gz"));

  var storage = new _storage.Storage();

  function syncIt() {
    return _syncIt.apply(this, arguments);
  }

  function _syncIt() {
    _syncIt = _asyncToGenerator(function* () {
      var options = {
        destination: destFilename
      };
      console.log("Downloading MySQL dump from ".concat(sourceDatabase));
      yield storage.bucket(bucket).file(srcFilename).download(options);
      console.log("gs://".concat(bucket, "/").concat(srcFilename, " downloaded to ").concat(destFilename, ", now uncompressing..."));
      var unzipped = new Promise((resolve, reject) => {
        var zippedContents = _fs.default.createReadStream(destFilename);

        var unzippedContents = _fs.default.createWriteStream(srcFilenameUnzipped);

        var unzip = _zlib.default.createGunzip(); // eslint-disable-next-line consistent-return


        zippedContents.pipe(unzip).pipe(unzippedContents).on('finish', err => {
          if (err) return reject(err);
          resolve();
        });
      });
      yield unzipped;
      console.log("DB Dump Unzipped to ".concat(srcFilenameUnzipped, ", running find-replace..."));
      var replaced = new Promise((resolve, reject) => {
        _fs.default.createReadStream(srcFilenameUnzipped).pipe((0, _replacestream.default)(sourceDatabase, targetDatabase)).pipe(_fs.default.createWriteStream(srcFilenameReplaced)) // eslint-disable-next-line consistent-return
        .on('finish', err => {
          if (err) return reject(err);
          resolve();
        });
      });
      yield replaced;
      console.log('Ran find-replace, now re-compressing...');

      _fs.default.unlink(srcFilenameUnzipped, () => {});

      var rezipped = new Promise((resolve, reject) => {
        var toZipContents = _fs.default.createReadStream(srcFilenameReplaced);

        var rezippedContents = _fs.default.createWriteStream(destFilename);

        var rezip = _zlib.default.createGzip(); // eslint-disable-next-line consistent-return


        toZipContents.pipe(rezip).pipe(rezippedContents).on('finish', err => {
          if (err) return reject(err);
          resolve();
        });
      });
      yield rezipped;
      console.log("DB Dump re-zipped to ".concat(destFilename, "!"));

      _fs.default.unlink(srcFilenameReplaced, () => {});

      if (targetDatabase === 'wordpress') {
        return;
      }

      try {
        var storageOptions = {
          resumable: false
        };
        var uploadResults = yield storage.bucket(bucket).upload(destFilename, storageOptions);
        console.log("".concat(destFilename, " uploaded to ").concat(bucket, "."), uploadResults);
      } catch (error) {
        console.error('Error occurred while uploading:', error);
      }

      var authRes = yield _googleAuthLibrary.auth.getApplicationDefault();
      var authClient = authRes.credential;
      var request = {
        project,
        instance,
        resource: {
          importContext: {
            kind: 'sql#importContext',
            fileType: 'SQL',
            uri: "gs://".concat(bucket, "/sync-").concat(targetDatabase, ".sql.gz"),
            databases: [targetDatabase]
          }
        },
        auth: authClient
      };

      try {
        var importResults = yield sqladmin.instances.import(request);
        console.log("".concat(destFilename, " uploaded to ").concat(bucket, "."), importResults);

        _fs.default.unlink(destFilename, () => {});
      } catch (error) {
        console.error('Error occurred while importing:', error);
      }
    });
    return _syncIt.apply(this, arguments);
  }

  syncIt();
};