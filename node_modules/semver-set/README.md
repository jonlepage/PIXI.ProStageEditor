# semver-set

Set operations for semver.

## Usage

### intersect

Find the intersection of multiple semver ranges. This can be useful for finding a "lowest common denominator" of versions.

```javascript
import { intersect } from 'semver-set';

// ^2.2.0
intersect('^1.1 || ^2.2 || >=5', '^2.2.0-alpha1');

// null
intersect('~2.2.4', '~2.3.0');
```
