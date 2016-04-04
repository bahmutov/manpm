'use strict';

var log = require('debug')('manpm');
var la = require('lazy-ass');
var check = require('check-more-types');
var getReadme = require('./get-readme');
var findSection = require('./find-section');
la(check.fn(findSection), 'missing find section');

var marked = require('marked');
var TerminalMarkdown = require('marked-terminal');
marked.setOptions({
  renderer: new TerminalMarkdown()
});

function printMarkdown(md) {
  console.log(marked(md));
}

function maNpm(options) {
  la(check.object(options), 'missing input options');
  la(check.unemptyString(options.name), 'missing package name', options);

  return getReadme(options.name)
    .then(findSection.bind(null, options))
    .then(printMarkdown)
    .catch(function (err) {
      console.error(err);
      log(err.stack);
    });
}

module.exports = maNpm;

if (!module.parent) {
  log('stand alone demo');
  maNpm({ name: 'obind' });
}
