# parse-uri

![Last version](https://img.shields.io/github/tag/Kikobeats/parse-uri.svg?style=flat-square)
[![Build Status](http://img.shields.io/travis/Kikobeats/parse-uri/master.svg?style=flat-square)](https://travis-ci.org/Kikobeats/parse-uri)
[![Dependency status](http://img.shields.io/david/Kikobeats/parse-uri.svg?style=flat-square)](https://david-dm.org/Kikobeats/parse-uri)
[![Dev Dependencies Status](http://img.shields.io/david/dev/Kikobeats/parse-uri.svg?style=flat-square)](https://david-dm.org/Kikobeats/parse-uri#info=devDependencies)
[![NPM Status](http://img.shields.io/npm/dm/parse-uri.svg?style=flat-square)](https://www.npmjs.org/package/parse-uri)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg?style=flat-square)](https://paypal.me/Kikobeats)

> Lightweight module for parse an URI. Based in [Steven Levithan](http://blog.stevenlevithan.com/archives/parseuri) method.

## Install

```bash
$ npm install parse-uri --save
```

If you want to use in the browser (powered by [Browserify](http://browserify.org/)):

```bash
$ bower install parse-uri --save
```

and later link in your HTML:

```html
<script src="bower_components/parse-uri/dist/parse-uri.js"></script>
```

## Usage

```js
var parseUri = require('parse-uri')

parseUri('myURL')
```

## License

MIT © [Kiko Beats](http://kikobeats.com)
