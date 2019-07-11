// Utils

// throttled function wrapper
// checkout: https://codeburst.io/throttling-and-debouncing-in-javascript-646d076d0a44
const throttled = (delay, fn) => {
    let lastCall = 0;
    return function (...args) {
        const now = (new Date).getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return fn(...args);
    }
}

// toy hash for prefixes
// useful for prefexing localstorage keys
const hashCode = (str, base = 16) => {
    return [str.split("")
    .reduce(function(a, b) {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a
    }, 0)] // create simple hash from string
    .map(num => Math.abs(num)) // only positive numbers
    .map(num => num.toString(base)) // convert to base
    .reduce(h => h); // fold
}

export { throttled, hashCode };