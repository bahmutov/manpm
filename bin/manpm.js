#!/usr/bin/env node --harmony

require('simple-bin-help')({
  minArguments: 3,
  packagePath: __dirname + '/../package.json',
  help: 'USE: manpm <NPM package name | github user/repo name> [optional search text]'
});

var name = process.argv[2];
var search = process.argv[3];
var maNpm = require('../src/index');
maNpm({
  name: name,
  search: search
});
