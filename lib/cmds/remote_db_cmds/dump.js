"use strict";

var _shelljs = require("shelljs");

var _googleapis = require("googleapis");

var _googleAuthLibrary = require("google-auth-library");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var sqladmin = _googleapis.google.sql('v1beta4');

exports.command = 'dump';
exports.desc = 'Export a dump of a remote MySQL database';
exports.builder = {
  environment: {
    alias: 'e',
    default: 'production'
  },
  bucket: {
    alias: 'b'
  },
  project: {
    alias: 'p'
  },
  instance: {
    alias: 'i'
  }
};

exports.handler = argv => {
  var repoName = (0, _shelljs.exec)("printf \"%s\" \"$(node -p \"require('./package.json').name\")\"", {
    silent: true
  }).stdout;
  var bucket = argv.bucket ? argv.bucket : (0, _shelljs.exec)("printf \"%s\" \"$(node -p \"require('./package.json').config.dbBucketName\")\"", {
    silent: true
  }).stdout;
  var instance = argv.instance ? argv.instance : (0, _shelljs.exec)("printf \"%s\" \"$(node -p \"require('./package.json').config.dbProdInstanceName\")\"", {
    silent: true
  }).stdout;
  var project = argv.project ? argv.project : (0, _shelljs.exec)("printf \"%s\" \"$(node -p \"require('./package.json').config.gcpProjectName\")\"", {
    silent: true
  }).stdout;

  if (!bucket || bucket === 'undefined' || !instance || instance === 'undefined' || !project || project === 'undefined') {
    console.log('Dump not attempted, information missing. Did you set up your GCP defaults in the package.json config?');
    return;
  }

  var {
    environment
  } = argv;
  var sourceDatabase = "".concat(repoName, "-").concat(environment);

  function dumpIt() {
    return _dumpIt.apply(this, arguments);
  }

  function _dumpIt() {
    _dumpIt = _asyncToGenerator(function* () {
      var authRes = yield _googleAuthLibrary.auth.getApplicationDefault();
      var authClient = authRes.credential;
      var request = {
        project,
        instance,
        resource: {
          exportContext: {
            kind: 'sql#exportContext',
            fileType: 'SQL',
            uri: "gs://".concat(bucket, "/sync-").concat(sourceDatabase, ".sql.gz"),
            databases: [sourceDatabase]
          }
        },
        auth: authClient
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
    });
    return _dumpIt.apply(this, arguments);
  }

  dumpIt();
};