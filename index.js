var log = require('debug')('manpm');
var la = require('lazy-ass');
var check = require('check-more-types');
var Promise = require('bluebird');
var getReadme = Promise.promisify(require('get-package-readme'));

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
  log('fetching README for package', options.name);
  return getReadme(options.name)
    .then(printMarkdown)
    .catch(console.error.bind(console));
}

module.exports = maNpm;

if (!module.parent) {
  log('stand alone demo');
  maNpm({ name: 'obind' });
}
