var la = require('lazy-ass');
var check = require('check-more-types');
var describeIt = require('describe-it');
var getReadmeFilename = require('path').join(__dirname, 'get-readme.js');

/* global it */

describeIt(getReadmeFilename, 'maybeGithubRepoName(name)', function () {
  it('returns true for common repos', function () {
    var cases = [
      'foo/bar',
      'bahmutov/manpm',
      'bahmutov/describe-it',
      'bevacqua/es6'
    ];
    cases.forEach(function (c) {
      la(this.maybeGithubRepoName(c), c);
    }.bind(this));
  });

  it('returns false for non repos', function () {
    la(!this.maybeGithubRepoName('foo/bar/baz'));
    la(!this.maybeGithubRepoName('git@github.com:bahmutov/object-fitter.git'));
  });
});

describeIt(getReadmeFilename, 'maybeGithubRepoUrl(name)', function () {
  it('returns true for common repo urls', function () {
    var cases = [
      'https://github.com/bevacqua/es6',
      'git@github.com:bevacqua/es6.git'
    ];
    cases.forEach(function (c) {
      la(this.maybeGithubRepoUrl(c), c);
    }.bind(this));
  });
});

describeIt(getReadmeFilename, 'parseGithub(url)', function () {
  it('parses es6 repo url', function () {
    var url = 'https://github.com/bevacqua/es6';
    var parsed = this.parseGithub(url);
    la(check.object(parsed), parsed);
    la(parsed.user === 'bevacqua', 'invalid username', parsed);
    la(parsed.repo === 'es6', 'invalid repo', parsed);
  });

  it('parses es6 .git repo url', function () {
    var url = 'git@github.com:bevacqua/es6.git';
    var parsed = this.parseGithub(url);
    la(check.object(parsed), parsed);
    la(parsed.user === 'bevacqua', 'invalid username', parsed);
    la(parsed.repo === 'es6', 'invalid repo', parsed);
  });

  it('parses user/repo format', function () {
    var url = 'bevacqua/es6';
    var parsed = this.parseGithub(url);
    la(check.object(parsed), parsed);
    la(parsed.user === 'bevacqua', 'invalid username', parsed);
    la(parsed.repo === 'es6', 'invalid repo', parsed);
  });
});
