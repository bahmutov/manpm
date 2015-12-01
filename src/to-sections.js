var la = require('lazy-ass');
var check = require('check-more-types');

function toSections(tokens) {
  la(check.array(tokens), 'expected markdown tokens list', tokens);

  var foundSections = [], current;
  tokens.forEach(function (token) {
    if (token.type === 'heading') {
      if (current) {
        foundSections.push(current);
      }
      current = [token];
      return;
    } else if (current) {
      current.push(token);
    }
  });
  if (current) {
    foundSections.push(current);
  }

  foundSections.forEach(function (section) {
    section.links = tokens.links;
  });
  return foundSections;
}

module.exports = toSections;
