var la = require('lazy-ass');
var check = require('check-more-types');
var quote = require('quote');

/* global describe, it */

// had to remove describe-it - it was conflicting with really-need
/*
var partJs = require('path').join(__dirname, 'find-section.js');
var marked = require('marked');
var describeIt = require('describe-it');
describeIt(partJs, 'findSectionByHeader(search, tokens)', function () {
  it('is a function', function () {
    la(check.fn(this.findSectionByHeader));
  });

  it('finds single section by text in the header', function () {
    var text = [
      '# foo is awesome',
      'bar',
      '# baz is worse',
      'something else'
    ].join('\n');
    var tokens = marked.lexer(text);
    var section = this.findSectionByHeader('foo', tokens);
    la(check.unemptyArray(section), section);
    la(section.length === 2, section);
    la(section[0].text === 'foo is awesome', section[0]);
    la(section[1].text === 'bar', section[1]);
  });

  it('finds two adjoining sections by text in the header', function () {
    var text = [
      '# foo is awesome',
      'bar',
      '# baz is worse than foo',
      'something else'
    ].join('\n');
    var tokens = marked.lexer(text);
    var section = this.findSectionByHeader('foo', tokens);

    la(check.unemptyArray(section), section);
    la(section.length === 4, section);
    la(section[0].text === 'foo is awesome', section[0]);
    la(section[2].text === 'baz is worse than foo', section[2]);
  });

  it('finds two separate sections by text in the header', function () {
    var text = [
      '# foo is awesome',
      'bar',

      '# something else in the middle',
      'something else',

      '# baz is worse than foo',
      'something else'
    ].join('\n');
    var tokens = marked.lexer(text);
    var section = this.findSectionByHeader('foo', tokens);

    la(check.unemptyArray(section), section);
    la(section.length === 4, section);
    la(section[0].text === 'foo is awesome', section[0]);
    la(section[2].text === 'baz is worse than foo', section[2]);
  });
});

describeIt(partJs, 'var toTokens', function () {
  it('is a function', function () {
    la(check.fn(this.toTokens));
  });

  it('parses 2 paragraphs', function () {
    var text = ['# p1', 'foo', '# p2', 'bar'].join('\n');
    var tokens = this.toTokens(text);
    la(check.array(tokens));
    la(tokens.length === 4);

    la(tokens[0].type === 'heading', tokens);
    la(tokens[0].text === 'p1', tokens);

    la(tokens[1].type === 'paragraph', tokens);
    la(tokens[1].text === 'foo', tokens);

    la(tokens[2].type === 'heading', tokens);
    la(tokens[2].text === 'p2', tokens);

    la(tokens[3].type === 'paragraph', tokens);
    la(tokens[3].text === 'bar', tokens);
  });
});
*/

describe('find section', function () {
  var find = require('./find-section');

  it('is a function', function () {
    la(check.fn(find));
  });

  it('returns entire text without options', function () {
    var text = 'foo';
    var section = find(undefined, text);
    la(text === section);
  });

  it('returns entire text without search', function () {
    var text = 'foo';
    var section = find({}, text);
    la(text === section);
  });

  it('returns entire text if there are no sections', function () {
    var text = 'foo bar\nbaz 42';
    var search = { text: 'baz' };
    var found = find(search, text);
    la(found === text, 'found', found);
  });

  it('finds first section after header with text', function () {
    var text = [
      '# foo is awesome',
      'bar',
      '# baz is worse',
      'something else'
    ];
    var search = { text: 'foo' };
    var found = find(search, text.join('\n'));
    la(check.unemptyString(found));
    var firstSection = text.slice(0, 2).join('\n');
    la(found === firstSection, 'found\n' + quote(found), '\ninstead of\n' + quote(firstSection));
  });

  it('finds word inside the section', function () {
    var text = [
      '# 1 is foo',
      'foo is awesome',
      '# 2 is bar',
      'bar is not as good'
    ];
    var search = { text: 'awesome' };
    var expected = text.slice(0, 2).join('\n');
    var found = find(search, text.join('\n'));
    la(check.unemptyString(found), 'could not find', search);
    la(found === expected, 'found first section\n' + found);
  });
});
