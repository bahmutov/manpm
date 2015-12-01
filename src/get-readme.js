var log = require('debug')('manpm');
var la = require('lazy-ass');
var check = require('check-more-types');
var Promise = require('bluebird');
var getReadmeFile = Promise.promisify(require('get-package-readme'));
var simpleGet = require('simple-get');
var parseGithubRepoUrl = require('parse-github-repo-url');

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

// TODO move to kensho/check-more-types
function maybeGithubRepoName(name) {
  var regular = /^[a-zA-Z0-9]+\/[a-zA-Z0-9\-\.]+$/;
  return regular.test(name);
}

function maybeGithubRepoUrl(name) {
  return Array.isArray(parseGithubRepoUrl(name));
}

function parseGithub(url) {
  log('parsing github url', url);
  var parsed = parseGithubRepoUrl(url);
  la(check.array(parsed), 'could not parse github url', url);
  return {
    user: parsed[0],
    repo: parsed[1]
  };
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
  var parsed = parseGithub(name);
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

  if (maybeGithubRepoName(name)) {
    log('fetching README for github repo', name);
    return getReadmeFromGithub(name);
  } else if (maybeGithubRepoUrl(name)) {
    log('fetching README for github url', name);
    return getReadmeFromGithub(name);
  } else {
    log('fetching README for package', name);
    return getReadmeFile(name);
  }
}

module.exports = getReadme;
