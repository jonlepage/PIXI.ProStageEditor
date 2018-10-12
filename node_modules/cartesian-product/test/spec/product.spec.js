
'use strict';

var path = require('path'),
	product = require(path.join(__dirname, '..', '..'));

describe('#product', function() {

	it('should return a nested empty array when arguments are empty', function() {
		expect(product([])).to.deep.equal([[]]);
	});

	it('should throw TypeError when not given an array', function() {
		expect(function() {
			product(false);
		}).to.throw(TypeError);
	});

	it('should return the correct product', function() {
		var result = product([ [ 1, 2 ], [ 3, 4 ] ]);
		expect(result).to.have.length(4);
		expect(result).to.deep.have.members([
			[1, 3],
			[1, 4],
			[2, 3],
			[2, 4]
		]);
	});
});
