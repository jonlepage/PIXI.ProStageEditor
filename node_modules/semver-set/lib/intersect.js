
var semver = require('semver');
var product = require('cartesian-product');
var _ = require('lodash');
var invariant = require('invariant');

var pluck = _.pluck;
var reduce = _.reduce;
var map = _.map;
var flatten = _.flatten;
var filter = _.filter;

var lowest = { semver: -Infinity, operator: '>' };
var highest = { semver: Infinity, operator: '<' };

function cmp(a, b) {
	if (a === '<' && b === '<=') {
		return -1;
	} else if (a === '<=' && b === '<') {
		return 1;
	} else if (a === '>' && b === '>=') {
		return 1;
	} else if (a === '>=' && b === '>') {
		return -1;
	} else {
		return 0;
	}
}

function icmp(a, b) {
	if (a === Infinity) {
		return 1;
	} else if (b === Infinity) {
		return -1;
	} else if (a === -Infinity) {
		return -1;
	} else if (b === -Infinity) {
		return 1;
	} else {
		return 0;
	}
}

function rcmp(a, b) {
	return icmp(a.semver, b.semver) ||
		semver.compare(a.semver, b.semver) ||
		cmp(a.operator, b.operator);
}

function min(a, b) {
	return rcmp(a, b) < 0 ? a : b;
}

function max(a, b) {
	return rcmp(a, b) > 0 ? a : b;
}

function isHi(entry) {
	return /^<?=?$/.test(entry.operator);
}

function isLo(entry) {
	return /^>?=?$/.test(entry.operator);
}

function combine(set, a) {

	var hi = set[1],
		lo = set[0];

	invariant(isLo(lo), 'lo entry must be a lower bound');
	invariant(isHi(hi), 'hi entry must be an upper bound');

	if (isHi(a)) {
		hi = min(a, hi);
	}

	if (isLo(a)) {
		lo = max(a, lo);
	}

	return [lo, hi];
}

function intersect() {
	ranges = map(arguments, semver.Range);
	// item.set is an array of disjunctions – we can match any of the entries
	// this means we must take the cartesian product of all the disjunctions,
	// intersect them with each other, and take the disjunction of the result
	// naturally any empty results can simply be omitted.

	ranges = filter(map(product(pluck(ranges, 'set')), function(values) {
		return reduce(flatten(values), combine, [ lowest, highest ]);
	}), function(entry) {
		var lo = entry[0], hi = entry[1];
		return lo.test(hi.semver) && hi.test(lo.semver);
	});

	ranges = map(ranges, function(range) {
		var lo = range[0], hi = range[1];
		if (lo.operator === '>=' && hi.operator === '<') {
			if (/\.0\.0$/.test(hi.semver.raw)) {
				return '^' + lo.semver.raw;
			} else if (/\.0$/.test(hi.semver.raw)) {
				// Anything in the 0.x.x line behaves like ~ even for the ^
				// operator.
				if (/^0\./.test(lo.semver.raw)) {
					return '^' + lo.semver.raw;
				} else {
					return '~' + lo.semver.raw;
				}
			}
		}
		return lo.operator+lo.semver.raw + ' && ' + hi.operator+hi.semver.raw;
	});

	if (ranges.length === 0) {
		return null;
	}

	return ranges.join(' || ');
}

module.exports = intersect;
