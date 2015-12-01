var la = require('lazy-ass');
var check = require('check-more-types');
var utils = require('./utils');

/* global describe, it */

describe('maybeGithubRepoName(name)', function () {
  it('returns true for common repos', function () {
    var cases = [
      'foo/bar',
      'bahmutov/manpm',
      'bahmutov/describe-it',
      'bevacqua/es6'
    ];
    cases.forEach(function (c) {
      la(utils.maybeGithubRepoName(c), c);
    });
  });

  it('returns false for non repos', function () {
    la(!utils.maybeGithubRepoName('foo/bar/baz'));
    la(!utils.maybeGithubRepoName('git@github.com:bahmutov/object-fitter.git'));
  });
});

describe('maybeGithubRepoUrl(name)', function () {
  it('returns true for common repo urls', function () {
    var cases = [
      'https://github.com/bevacqua/es6',
      'git@github.com:bevacqua/es6.git'
    ];
    cases.forEach(function (c) {
      la(utils.maybeGithubRepoUrl(c), c);
    });
  });
});

describe('parseGithub(url)', function () {
  it('parses es6 repo url', function () {
    var url = 'https://github.com/bevacqua/es6';
    var parsed = utils.parseGithub(url);
    la(check.object(parsed), parsed);
    la(parsed.user === 'bevacqua', 'invalid username', parsed);
    la(parsed.repo === 'es6', 'invalid repo', parsed);
  });

  it('parses es6 .git repo url', function () {
    var url = 'git@github.com:bevacqua/es6.git';
    var parsed = utils.parseGithub(url);
    la(check.object(parsed), parsed);
    la(parsed.user === 'bevacqua', 'invalid username', parsed);
    la(parsed.repo === 'es6', 'invalid repo', parsed);
  });

  it('parses user/repo format', function () {
    var url = 'bevacqua/es6';
    var parsed = utils.parseGithub(url);
    la(check.object(parsed), parsed);
    la(parsed.user === 'bevacqua', 'invalid username', parsed);
    la(parsed.repo === 'es6', 'invalid repo', parsed);
  });
});
