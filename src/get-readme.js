'use strict';

var log = require('debug')('manpm');
var la = require('lazy-ass');
var check = require('check-more-types');
var utils = require('./utils');

var Promise = require('bluebird');
var packageJson = require('package-json');
var simpleGet = require('simple-get');

function get(url) {
  return new Promise(function (resolve, reject) {
    log('getting from url', url);
    simpleGet.concat(url, function (err, data, res) {
      if (err) {
        log('simple get error from url', url, err);
        return reject(err);
      }
      if (res.statusCode !== 200) {
        log('while fetching from', url, 'got', res.statusCode);
        log(res);
        return reject(new Error('GET from ' + url + ' status ' + res.statusCode));
      }
      return resolve(data);
    });
  });
}

var githubSchema = {
  user: check.unemptyString,
  repo: check.unemptyString
};
var isValidGithubInfo = check.schema.bind(null, githubSchema);

function toString(x) {
  return x.toString();
}

function formGithubUrl(info, filename) {
  la(isValidGithubInfo(info), 'missing github info', info);
  la(check.unemptyString(filename), 'missing filename', filename);
  var fullUrl = 'https://raw.githubusercontent.com/' + info.user +
    '/' + info.repo +
    '/master/' + filename;
  return fullUrl;
}

function getReadmeFromGithub(name) {
  la(check.unemptyString(name), 'missing github info', name);
  log('getting readme directly from github for', name);
  var parsed = utils.parseGithub(name);
  la(isValidGithubInfo(parsed), parsed, 'from', name);

  var fullUrl = formGithubUrl(parsed, 'README.md');
  la(check.unemptyString(fullUrl), 'missing url', fullUrl, 'from', parsed);
  log('fetching url from', fullUrl);

  return get(fullUrl)
    .catch(function () {
      // probably not found
      fullUrl = formGithubUrl(parsed, 'readme.md');
      log('fetching url from', fullUrl);
      return get(fullUrl);
    })
    .catch(function () {
      // probably not found
      fullUrl = formGithubUrl(parsed, 'readme.markdown');
      log('fetching url from', fullUrl);
      return get(fullUrl);
    })
    .then(toString);
}

function getLocalReadmeFile() {
  var fs = require('fs');
  var join = require('path').join;
  var filename = join(process.cwd(), 'README.md');
  return new Promise(function (resolve, reject) {
    if (!fs.existsSync(filename)) {
      return reject(new Error('Cannot find local file ' + filename));
    }
    return resolve(fs.readFileSync(filename, 'utf8'));
  });
}

function getReadme(name) {
  la(check.unemptyString(name), 'missing name');

  if (name === '.') {
    log('fetching README in the current working folder');
    return getLocalReadmeFile();
  }

  if (utils.maybeGithubRepoName(name)) {
    log('fetching README for github repo', name);
    return getReadmeFromGithub(name);
  }
  if (utils.maybeGithubRepoUrl(name)) {
    log('fetching README for github url', name);
    return getReadmeFromGithub(name);
  }

  log('fetching README for NPM package', name);
  return packageJson(name, 'latest')
    .then(function (json) {
      log('repository', json.repository);
      if (!json.repository) {
        throw new Error('Cannot find repository for ' + name);
      }
      la(check.unemptyString(json.repository.url),
        'missing url', json.repository);
      return getReadmeFromGithub(json.repository.url);
    });
}

module.exports = getReadme;
