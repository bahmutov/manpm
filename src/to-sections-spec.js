var la = require('lazy-ass');
var check = require('check-more-types');
var marked = require('marked');

/* global describe, it */

var toTokens = marked.lexer.bind(marked);

describe('to-sections', function () {
  var toSections = require('./to-sections');

  var text = [
    '# 1 is foo',
    'foo is awesome',
    '# 2 is bar',
    'bar is not as good'
  ].join('\n');
  var tokens = toTokens(text);
  la(check.array(tokens));

  it('is a function', function () {
    la(check.fn(toSections));
  });

  it('splits into 2 sections', function () {
    var sections = toSections(tokens);
    la(check.array(sections), sections);
    la(sections.length === 2, 'found 2 sections', sections);
  });

  it('first section has 2 items', function () {
    var sections = toSections(tokens);
    var first = sections[0];
    la(check.array(first), 'missing first section', first);
    la(first.length === 2, 'first has 2 tokens', first);
  });

  it('first section has links', function () {
    var sections = toSections(tokens);
    var first = sections[0];
    la(first.links, 'first section is missing links', first);
  });
});
