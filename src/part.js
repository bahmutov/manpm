var log = require('debug')('manpm');
var la = require('lazy-ass');
var check = require('check-more-types');
var marked = require('marked');
var mdRenderer = require('marked-to-md');
var renderer = mdRenderer(new marked.Renderer());
var parser = new marked.Parser({ renderer: renderer });

function markdownTokens(md) {
  var tokens = marked.lexer(md);
  return tokens;
}

// returns found tokens
function findSectionByHeader(search, tokens) {
  la(check.unemptyString(search), 'missing search', search);
  la(check.array(tokens), 'missing tokens', tokens);

  search = search.toLowerCase();

  var foundStart, foundEnd;

  var links = tokens.links;
  var foundTokens = [];

  tokens.forEach(function (token, k) {
    if (token.type !== 'heading' && !foundStart) {
      return;
    }
    if (token.type === 'heading') {
      var hasSearchText = token.text.toLowerCase().indexOf(search) !== -1;
      // console.log('checking heading', k, token.text, 'has text?', hasSearchText);

      if (check.not.defined(foundStart) && hasSearchText) {
        foundStart = k;
        return;
      }
      if (check.not.defined(foundStart) && !hasSearchText) {
        return;
      }
      foundEnd = k;

      var part = tokens.slice(foundStart, foundEnd);
      foundTokens = foundTokens.concat(part);
      foundStart = foundEnd = undefined;
      return;
    }
  });

  if (check.defined(foundStart) && check.not.defined(foundEnd)) {
    foundEnd = tokens.length;
  }
  if (check.defined(foundStart) &&
    check.defined(foundEnd)) {
    var part = tokens.slice(foundStart, foundEnd);
    foundTokens = foundTokens.concat(part);
  }

  if (check.not.empty(foundTokens)) {
    foundTokens.links = links;
  }
  return foundTokens;
}

function findSection(options, md) {
  la(check.maybe.object(options), 'missing options', options);
  la(check.unemptyString(md), 'missing markdown', md);

  options = options || {};

  var searchString = options.text || options.search;
  if (check.unemptyString(searchString)) {
    log('searching for markdown part that talks about', searchString);
  }
  if (!searchString) {
    return md;
  }

  var tokens = markdownTokens(md);
  var foundSectionByHeader = findSectionByHeader(searchString, tokens);
  if (check.unemptyArray(foundSectionByHeader)) {
    return parser.parse(foundSectionByHeader).trim();
  }

  return md;
}

module.exports = findSection;
