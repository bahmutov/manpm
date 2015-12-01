var log = require('debug')('manpm');
var la = require('lazy-ass');
var check = require('check-more-types');
var parseGithubRepoUrl = require('parse-github-repo-url');
var utils = require('./utils');

// working around github-url-to-object used inside get-package-readme
// that cannot handle www.github.com urls
/* eslint no-undef:0 */
require = require('really-need');
require('github-url-to-object', {
  post: function () {
    return function gh(url) {
      log('parsing github url %s ourselves', url);
      var parsed = parseGithubRepoUrl(url);
      return {
        user: parsed[0],
        repo: parsed[1]
      };
    };
  }
});

var Promise = require('bluebird');
var getReadmeFile = Promise.promisify(require('get-package-readme'));
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
      fullUrl = formGithubUrl(parsed, 'readme.markdown');
      log('fetching url from', fullUrl);
      return get(fullUrl);
    })
    .then(toString);
}

function getReadme(name) {
  la(check.unemptyString(name), 'missing name');

  if (utils.maybeGithubRepoName(name)) {
    log('fetching README for github repo', name);
    return getReadmeFromGithub(name);
  } else if (utils.maybeGithubRepoUrl(name)) {
    log('fetching README for github url', name);
    return getReadmeFromGithub(name);
  } else {
    log('fetching README for package', name);
    return getReadmeFile(name);
  }
}

module.exports = getReadme;
