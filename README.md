# manpm

> Shows the relevant part of NPM module's README file right in your terminal

[![NPM][manpm-icon] ][manpm-url]

[![CI][ci-badge] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]

[manpm-icon]: https://nodei.co/npm/manpm.png?downloads=true
[manpm-url]: https://npmjs.org/package/manpm
[ci-badge]: https://travis-ci.org/bahmutov/manpm.png?branch=master
[ci-url]: https://travis-ci.org/bahmutov/manpm
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release

## Install and use

    npm install -g manpm
    manpm <package name>
    manpm <package name> [optional search text inside README]

For example `manpm email-regex` will render the README from
[email-regex](https://www.npmjs.com/package/email-regex) package in you terminal

![manpm screenshot](images/manpm-screenshot.png)

If search text is provided, only a section of the README file with that text
(if found) will be displayed.

![manpm search section](images/search-section.png)

## Inspired by the following tools

* [man-n](https://github.com/man-n/man-n)
* [npm-man](https://github.com/eush77/npm-man)
* [readme](https://www.npmjs.com/package/readme)

I wanted something a little more API friendly, like finding and showing
a README section that talked about a specific API method for example.

### Small print

Author: Gleb Bahmutov &copy; 2015

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/manpm/issues) on Github

## MIT License

Copyright (c) 2015 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

