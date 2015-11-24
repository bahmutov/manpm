var la = require('lazy-ass');
var check = require('check-more-types');

/* global describe, it */
describe('find section', function () {
  var find = require('./part');

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
});
