var log = require('debug')('manpm');
var la = require('lazy-ass');
var check = require('check-more-types');
var parseGithubRepoUrl = require('@bahmutov/parse-github-repo-url');

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

module.exports = {
  maybeGithubRepoName: maybeGithubRepoName,
  maybeGithubRepoUrl: maybeGithubRepoUrl,
  parseGithub: parseGithub
};
