var log = require('debug')('manpm');
var la = require('lazy-ass');
var check = require('check-more-types');
var Promise = require('bluebird');
var getReadmeFile = Promise.promisify(require('get-package-readme'));
var get = Promise.promisify(require('simple-get').concat);
var parseGithubRepoUrl = require('parse-github-repo-url');

// TODO move to kensho/check-more-types
function maybeGithubRepoName(name) {
  var regular = /^[a-zA-Z0-9]+\/[a-zA-Z0-9\-\.]+$/;
  return regular.test(name);
}

function maybeGithubRepoUrl(name) {
  return Array.isArray(parseGithubRepoUrl(name));
}

function parseGithub(url) {
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

function getReadmeFromGithub(name) {
  la(check.unemptyString(name), 'missing github info', name);
  var parsed = parseGithub(name);
  la(isValidGithubInfo(parsed), parsed, 'from', name);

  // TODO handle readme file variants
  // README.markdown
  // readme.markdown
  var fullUrl = 'https://raw.githubusercontent.com/' + parsed.user +
    '/' + parsed.repo + '/master/README.md';
  log('fetching url from', fullUrl);
  return get(fullUrl)
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
