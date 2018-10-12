
var semver = require('semver');
var intersect = require('semver-set').intersect;
var json = require('jju');
var mapValues = require('lodash/object/mapValues');
var assign = require('lodash/object/assign');
var isEmpty = require('lodash/lang/isEmpty');
var filter = require('lodash/collection/filter');
var contains = require('lodash/collection/contains');
var has = require('lodash/object/has');

var handlers = {

	// Keywords
	keywords: unique,

	// Scripts
	scripts: exists,

	// General dependencies
	dependencies: updateDependencies,
	devDependencies: updateDependencies,
	peerDependencies: updateDependencies
}

/**
 * [scripts description]
 * @param {Object} dst [description]
 * @param {Object} src [description]
 * @returns {Object}     [description]
 */
function exists(dst, src) {
	return assign({ }, dst, src);
}

/**
 * Keywords work on an ensure-unique basis: if a keyword already exists in dst
 * then it is skipped, otherwise it is placed at the end of dst; the ordering of
 * keywords in src is preserved.
 * @param {Array} dst [description]
 * @param {Array} src [description]
 * @returns {Array}     [description]
 */
function unique(dst, src) {
	if (isEmpty(dst)) {
		return src;
	} else {
		return [].concat(dst, filter(src, function(keyword) {
			return contains(dst, keyword);
		}));
	}
}

function updateDependencies(dst, src) {
	return isEmpty(dst) ? src : assign({ }, dst, mapValues(src, function(version, dep) {
		// We need to check if both are indeed semver ranges in order to do
		// intersects – some may be git urls or other such things.
		var isSem = semver.validRange(version) && semver.validRange(dst[dep]);
		return isSem ? intersect(version, dst[dep]) || version : version;
	}));
}



/**
 * [combine description]
 * @param {Object} dst [description]
 * @param {Object} src [description]
 * @returns {Object} [description]
 */
function combine(dst, src) {
	return isEmpty(dst) ? src : assign({ }, dst, mapValues(src, function (value, key) {
		return has(handlers, key) ? handlers[key](dst[key], value) : value;
	}));
}

/**
 * [merge description]
 * @param {String} dst [description]
 * @param {String} src [description]
 * @returns {String} Result of merging src into dst.
 */
function merge(dst, src) {
	return json.update(dst, combine(json.parse(dst), json.parse(src)), { });
}

module.exports = merge;
