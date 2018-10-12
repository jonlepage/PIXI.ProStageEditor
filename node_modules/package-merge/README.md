# package-merge

Intelligently merge `package.json` files.

This is pretty much built for yeoman. It attempts to combine two separate `package.json` files into one, respecting as much existing content as possible including already existing dependencies and `package.json` formatting.

```javascript
var merge = require('package-merge');
var dst = fs.readFileSync('package.a.json');
var src = fs.readFileSync('package.b.json');

// Create a new `package.json`
console.log(merge(dst, src));
```

It allows you to do things like define scripts or dependencies that you would like to include as part of a larger project.

Merging:

```json
{
	"name": "my-package",
	"dependencies": {
		"babel": "^5.2.2",
		"lodash": "^3.2.5"
	}
}
```

```json
{
	"dependencies": {
		"babel": "^5.4.1",
		"eslint": "^0.22.1"
	}
}
```

results in:

```json
{
	"name": "my-package",
	"dependencies": {
		"babel": "^5.4.1",
		"lodash": "^3.2.5",
		"eslint": "^0.22.1"
	}
}
```
