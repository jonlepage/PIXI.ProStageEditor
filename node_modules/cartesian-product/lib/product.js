
'use strict';

function product(elements) {
	if (!Array.isArray(elements)) {
		throw new TypeError();
	}

	var end = elements.length - 1,
		result = [];

	function addTo(curr, start) {
		var first = elements[start],
			last = (start === end);

		for (var i = 0; i < first.length; ++i) {
			var copy = curr.slice();
			copy.push(first[i]);

			if (last) {
				result.push(copy);
			} else {
				addTo(copy, start + 1);
			}
		}
	}

	if (elements.length) {
		addTo([], 0);
	} else {
		result.push([]);
	}
	return result;
}

module.exports = product;
