import os from 'os';
import pkg from '../package.json';

function escape(s) { return s.replace('/', ':').replace(' ', '_'); }

export function promiseTimeout(ms, promise) {
  // Create a promise that rejects in <ms> milliseconds
  const timeout = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject('Promise timed out');
    }, ms);
  });
  // Returns a race between our timeout and the passed in promise
  return Promise.race([
    promise,
    timeout,
  ]);
}

// NOTE: before this can be an external module:
// 1. are all the JS features supported back to a reasonable version?
//    default params, template strings, computed property names
// 2. access to `pkg` will change
// 3. tests
// there will potentially be more named exports in this file
// eslint-disable-next-line import/prefer-default-export
export function packageIdentifier(addons = {}) {
  const identifierMap = Object.assign({
    [`${pkg.name}`]: pkg.version,
    [`${os.platform()}`]: os.release(),
    node: process.version.replace('v', ''),
  }, addons);
  return Object.keys(identifierMap).reduce((acc, k) => `${acc} ${escape(k)}/${escape(identifierMap[k])}`, '');
}
