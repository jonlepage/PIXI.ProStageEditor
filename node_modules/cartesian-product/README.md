# cartesian-product

Compute the cartesian product of an array.

![build status](http://img.shields.io/travis/izaakschroeder/cartesian-product.svg?style=flat)
![coverage](http://img.shields.io/coveralls/izaakschroeder/cartesian-product.svg?style=flat)
![license](http://img.shields.io/npm/l/cartesian-product.svg?style=flat)
![version](http://img.shields.io/npm/v/cartesian-product.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/cartesian-product.svg?style=flat)

Simple library to compute the cartesian product.

```javascript
var product = require('cartesian-product');
console.log(product([
	[1,2],
	[4,5]
]));
// [ [1,4], [1,5], [2,4], [2,5] ]
```
