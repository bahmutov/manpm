var log = require('debug')('manpm');
var verbose = require('debug')('verbose');

var la = require('lazy-ass');
var check = require('check-more-types');
var marked = require('marked');
var mdRenderer = require('marked-to-md');
var renderer = mdRenderer(new marked.Renderer());
var parser = new marked.Parser({ renderer: renderer });
var toSections = require('./to-sections');
var _ = require('lodash');

var toTokens = marked.lexer.bind(marked);

function fromTokens(tokens) {
  // parser.parse removes all items from tokens!
  var copy = _.clone(tokens, true);
  copy.links = _.clone(tokens.links, true);
  return parser.parse(copy);
}

// assumes search is lowercase text already
function hasText(text, search) {
  la(check.string(text), 'missing text', text);
  la(check.unemptyString(search), 'missing search', search);
  var has = text.toLowerCase().indexOf(search) !== -1;
  return has;
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
      verbose('checking heading', k, token.text,
        'has text?', hasSearchText,
        'start', foundStart, 'end', foundEnd);

      if (check.not.defined(foundStart) && hasSearchText) {
        foundStart = k;
        return;
      }
      if (check.not.defined(foundStart) && !hasSearchText) {
        return;
      }
      if (!hasSearchText) {
        foundEnd = k;

        verbose('part from %d to %d', foundStart, foundEnd);
        var part = tokens.slice(foundStart, foundEnd);
        foundTokens = foundTokens.concat(part);
        foundStart = foundEnd = undefined;
      }
    }
  });

  if (check.defined(foundStart) && check.not.defined(foundEnd)) {
    foundEnd = tokens.length;
  }
  if (check.defined(foundStart) &&
    check.defined(foundEnd)) {
    verbose('slicing part at the end %d to %d', foundStart, foundEnd);
    var part = tokens.slice(foundStart, foundEnd);
    foundTokens = foundTokens.concat(part);
  }

  if (check.not.empty(foundTokens)) {
    foundTokens.links = links;
  }
  return foundTokens;
}

// returns found tokens
function findSectionByText(search, tokens) {
  la(check.unemptyString(search), 'missing search', search);
  la(check.array(tokens), 'missing tokens', tokens);

  search = search.toLowerCase();

  var sections = toSections(tokens);
  la(check.array(sections),
    'could not find sections from tokens', tokens);

  var sectionsText = sections.map(fromTokens);

  var foundIndex = -1;
  sectionsText.some(function (sectionText, k) {
    if (hasText(sectionText, search)) {
      foundIndex = k;
      return true;
    }
  });

  if (foundIndex !== -1) {
    return sections[foundIndex];
  }
}

// if not found, returns entire text
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

  var tokens = toTokens(md);
  la(check.array(tokens), 'could not parse markdown', md);

  var foundSectionByHeader = findSectionByHeader(searchString, tokens);
  if (check.unemptyArray(foundSectionByHeader)) {
    return fromTokens(foundSectionByHeader).trim();
  }

  var foundSectionByText = findSectionByText(searchString, tokens);
  if (check.unemptyArray(foundSectionByText)) {
    return fromTokens(foundSectionByText).trim();
  }

  console.log('Cannot find the search string "%s", showing entire document',
    searchString);
  return md;
}

module.exports = findSection;
