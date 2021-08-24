'use strict';

// Dom functions 
require('./Polyfills/Dom');

// Number polyfill
// Some Number functions not available
require('./Polyfills/Number');

// Array polyfill 
// It will use the native implementation
require('./Polyfills/String');

// Math polyfill
// Some math functions not available
require('./Polyfills/Math');

// Array polyfill 
// It will use the native implementation
require('./Polyfills/Array');

// Object polyfill 
// It will use the native implementation
require('./Polyfills/Object');

// Set polyfill
// It will use the native implementation
require('./Polyfills/Set');

// Set polyfill
// It will use the native implementation
require('./Polyfills/Symbol');

// Map polyfill with ios8 fix
// It will use the native implementation
require('./Polyfills/Map');

// Promise polyfill
// It will use the native implementation
require('./Polyfills/Promise');

// Function polyfill
// Constructor name has no ie compatibility
require('./Polyfills/Function');

// Fetcher is a drop-in replacement and polyfill for fetch.
// Use fetcher instead of fetch to enable the cancellation of requests
// require('./Polyfills/Fetcher');

// Shim for webrtc
// To standarize webrtc functions for browsers
// require('./Polyfills/WebRTCAdapter');

// Buffer functions
// require('./Polyfills/Buffer');

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require('./Polyfills/ObjectAsign');

