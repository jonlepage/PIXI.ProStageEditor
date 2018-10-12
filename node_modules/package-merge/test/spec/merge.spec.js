
var fs = require('fs');
var path = require('path');
var merge = require('../../lib/merge');
var expect = require('chai').expect;

function fixture(name) {
	return fs.readFileSync(path.join(
		__dirname, '..', 'fixtures', name+'.fixture.json'
	), 'utf8');
}

describe('#merge', function() {

	it('should output valid JSON', function() {
		var result = merge(
			fixture('complete'),
			fixture('dependencies')
		);
		expect(function() {
			JSON.parse(result);
		}).to.not.throw();
	});

	it('should merge dependencies correctly', function() {
		var result = JSON.parse(merge(
			fixture('complete'),
			fixture('dependencies')
		));

		expect(result.dependencies).to.have.property('express', '^5.0.0');
	});

	it('should work on emptiness', function() {
		var result = JSON.parse(merge(
			fixture('complete'),
			fixture('dependencies')
		));

		expect(result.dependencies).to.have.property('express', '^5.0.0');
	});
});
