var log = require('debug')('manpm');
var la = require('lazy-ass');
var check = require('check-more-types');

function findSection(options, md) {
  la(check.maybe.object(options), 'missing options', options);
  la(check.unemptyString(md), 'missing markdown', md);

  options = options || {};

  var searchString = options.text || options.search;
  if (check.unemptyString(searchString)) {
    log('searching for markdown part that talks about', searchString);
  }

  return md;
}

module.exports = findSection;
