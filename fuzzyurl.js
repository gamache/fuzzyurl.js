(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Fuzzyurl = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @module fuzzyurl */

'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var Strings = require("./strings");
var Match = require("./match");
var Protocols = require("./protocols");

var defaultFuzzyurl = {
  protocol: null,
  username: null,
  password: null,
  hostname: null,
  port: null,
  path: null,
  query: null,
  fragment: null
};
var fields = Object.keys(defaultFuzzyurl);

/**
 * Creates a Fuzzyurl object with the given parameter values.  Valid
 * `params` keys are: `protocol`, `username`, `password`, `hostname`,
 * `port`, `path`, `query`, and `fragment`; all default to null.
 *
 * @param {object} params Parameter values.
 *
 */
function Fuzzyurl(params) {
  var ps = Object.assign({}, defaultFuzzyurl, params || {});
  for (var p in ps) {
    if (defaultFuzzyurl.hasOwnProperty(p)) this[p] = ps[p];else throw new Error("Bad Fuzzyurl parameter: " + p);
  }
};
module.exports = Fuzzyurl;

Fuzzyurl.prototype.equals = function (fu) {
  var _this = this;

  var equal = true;
  fields.forEach(function (f) {
    if (_this[f] != fu[f]) equal = false;
  });
  return equal;
};

/**
 * Returns a copy of this Fuzzyurl, with the given changes (if any).
 * Does not mutate this Fuzzyurl object.
 *
 * @param {object|null} params Fuzzyurl keys and values to override.
 * @returns {Fuzzyurl} Fuzzyurl based on this, with given overrides.
 */
module.exports.prototype.with = function (params) {
  var _this2 = this;

  var ps = params || {};
  var f = new Fuzzyurl();
  fields.forEach(function (field) {
    if (ps.hasOwnProperty(field)) f[field] = ps[field];else f[field] = _this2[field];
  });
  return f;
};

/**
 * Returns a URL mask from the given string or object.  Unspecified URL
 * parts default to a wildcard, `*`.
 *
 * @param {object|string|null} params Object or string to create mask from.
 * @returns {Fuzzyurl} Fuzzyurl mask object.
 */
module.exports.mask = function (params) {
  var fu;
  if (typeof params == "string") {
    fu = Fuzzyurl.fromString(params, { default: "*" });
  } else if (!params) {
    fu = {};
  } else if ((typeof params === "undefined" ? "undefined" : _typeof(params)) == "object") {
    fu = params;
  } else {
    throw new Error("params must be string, object, or null");
  }

  var m = new Fuzzyurl(maskDefaults);
  Object.keys(fu).forEach(function (k) {
    if (fu[k]) m[k] = fu[k];
  });
  return m;
};
var maskDefaults = {
  protocol: "*", username: "*", password: "*", hostname: "*",
  port: "*", path: "*", query: "*", fragment: "*"
};

/**
 * Returns a string representation of the given Fuzzyurl object.
 *
 * @param {Fuzzyurl} fuzzyurl Fuzzyurl object to convert to string format.
 * @returns {string} String representation of `fuzzyurl`.
 */
module.exports.toString = function (fuzzyurl) {
  return Strings.toString(fuzzyurl);
};

/**
 * Returns a string representation of this Fuzzyurl object.
 *
 * @returns {string} String representation of `fuzzyurl`.
 */
module.exports.prototype.toString = function () {
  return Strings.toString(this);
};

/**
 * From a given string URL or URL mask, returns a Fuzzyurl object that
 * represents it.  Option `default` specifies the Fuzzyurl's default field
 * value; pass `default: "*"` to create a URL mask.
 *
 * @param {string} str The URL or URL mask to convert to a Fuzzyurl object.
 * @returns {Fuzzyurl} Fuzzyurl representation of `str`.
 */
module.exports.fromString = function (string) {
  return new Fuzzyurl(Strings.fromString(string));
};

/**
 * If `mask` (which may contain * wildcards) matches `url` (which may not),
 * returns an integer representing how closely they match (higher is closer).
 * If `mask` does not match `url`, returns null.
 *
 * `mask` and `url` may each be a string or Fuzzyurl object.
 *
 * @param {Fuzzyurl|string} mask  Fuzzyurl mask to match with
 * @param {Fuzzyurl|string} url   Fuzzyurl URL to match
 * @returns {integer|null} total match score, or null if no match
 *
 */
module.exports.match = function (mask, url) {
  var m = typeof mask === "string" ? Strings.fromString(mask, { default: "*" }) : mask;
  var u = typeof url === "string" ? Strings.fromString(url) : url;
  return Match.match(m, u);
};

/**
 * If `mask` (which may contain * wildcards) matches `url` (which may not),
 * returns true; otherwise returns false.
 *
 * `mask` and `url` may each be a string or Fuzzyurl object.
 *
 * @param {Fuzzyurl|string} mask  Fuzzyurl mask to match with
 * @param {Fuzzyurl|string} url   Fuzzyurl URL to match
 * @returns {boolean} true if mask matches url, false otherwise
 */
module.exports.matches = function (mask, url) {
  var m = typeof mask === "string" ? Strings.fromString(mask, { default: "*" }) : mask;
  var u = typeof url === "string" ? Strings.fromString(url) : url;
  return Match.matches(m, u);
};

/**
 * Returns a Fuzzyurl-like object containing values representing how well
 * different parts of `mask` and `url` match.  Values are integers for
 * matches or null for no match; higher integers indicate a better match.
 *
 * `mask` and `url` may each be a string or Fuzzyurl object.
 *
 * @param {Fuzzyurl|string} mask  Fuzzyurl mask to match with
 * @param {Fuzzyurl|string} url   Fuzzyurl URL to match
 * @returns {Fuzzyurl} Fuzzyurl-like object containing match scores
 */
module.exports.matchScores = function (mask, url) {
  var m = typeof mask === "string" ? Strings.fromString(mask, { default: "*" }) : mask;
  var u = typeof url === "string" ? Strings.fromString(url) : url;
  return Match.matchScores(m, u);
};

/**
 * If `mask` (which may contain * wildcards) matches `url` (which may not),
 * returns 1 if `mask` and `url` match perfectly, 0 if `mask` and `url`
 * are a wildcard match, or null otherwise.
 *
 * Wildcard language:
 *
 *     *              matches anything
 *     foo/*          matches "foo/" and "foo/bar/baz" but not "foo"
 *     foo/**         matches "foo/" and "foo/bar/baz" and "foo"
 *     *.example.com  matches "api.v1.example.com" but not "example.com"
 *     **.example.com matches "api.v1.example.com" and "example.com"
 *
 * Any other form is treated as a literal match.
 *
 * @param {string} mask  String mask to match with (may contain wildcards).
 * @param {string} value String value to match.
 * @returns {integer|null} 1 for perfect match, 0 for wildcard match, null otherwise.
 */
module.exports.fuzzyMatch = function (mask, value) {
  return Match.fuzzyMatch(mask, value);
};

/**
 * From a list of Fuzzyurl `masks`, returns the index of the one which best
 * matches `url`.  Returns null if none of `masks` match.
 *
 * `url` and each element of `masks` may be either a Fuzzyurl object or
 * a string representation.
 *
 * @param {array} masks  Array of Fuzzyurl URL masks to match with.
 * @param {Fuzzyurl} url Fuzzyurl URL to match.
 * @returns {integer|null} Index of best matching mask, or null if none match.
 */
module.exports.bestMatchIndex = function (masks, url) {
  var ms = masks.map(function (m) {
    return typeof m === "string" ? Strings.fromString(m, { default: "*" }) : m;
  });
  var u = typeof url === "string" ? Strings.fromString(url) : url;
  return Match.bestMatchIndex(ms, u);
};

/**
 * From a list of Fuzzyurl `masks`, returns the one which best
 * matches `url`.  Returns null if none of `masks` match.
 *
 * `url` and each element of `masks` may be either a Fuzzyurl object or
 * a string representation.
 *
 * @param {array} masks  Array of Fuzzyurl URL masks to match with.
 * @param {Fuzzyurl} url Fuzzyurl URL to match.
 * @returns {integer|null} Index of best matching mask, or null if none match.
 */
module.exports.bestMatch = function (masks, url) {
  var index = Fuzzyurl.bestMatchIndex(masks, url);
  return index && masks[index];
};

},{"./match":2,"./protocols":3,"./strings":4}],2:[function(require,module,exports){
/** @module fuzzyurl/match */

'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var Protocols = require('./protocols');

/**
 * If `mask` (which may contain * wildcards) matches `url` (which may not),
 * returns an integer representing how closely they match (higher is closer).
 * If `mask` does not match `url`, returns null.
 *
 * @param {Fuzzyurl} mask  Fuzzyurl mask to match with
 * @param {Fuzzyurl} url   Fuzzyurl URL to match
 * @returns {integer|null} total match score, or null if no match
 *
 */
function match(mask, url) {
  var scores = matchScores(mask, url);
  var scoreValues = Object.keys(scores).map(function (k) {
    return scores[k];
  });
  if (scoreValues.indexOf(null) >= 0) return null;
  return scoreValues.reduce(function (x, y) {
    return x + y;
  });
}

/**
 * If `mask` (which may contain * wildcards) matches `url` (which may not),
 * returns true; otherwise returns false.
 *
 * @param {Fuzzyurl} mask  Fuzzyurl mask to match with
 * @param {Fuzzyurl} url   Fuzzyurl URL to match
 * @returns {boolean} true if mask matches url, false otherwise
 */
function matches(mask, url) {
  return match(mask, url) !== null;
}

/**
 * Returns a Fuzzyurl-like object containing values representing how well
 * different parts of `mask` and `url` match.  Values are integers for
 * matches or null for no match; higher integers indicate a better match.
 *
 * @param {Fuzzyurl} mask  Fuzzyurl mask to match with
 * @param {Fuzzyurl} url   Fuzzyurl URL to match
 * @returns {Fuzzyurl} Fuzzyurl-like object containing match scores
 */
function matchScores(mask, url) {
  if ("object" !== (typeof mask === 'undefined' ? 'undefined' : _typeof(mask))) throw new Error('mask must be a Fuzzyurl object');
  if ("object" !== (typeof url === 'undefined' ? 'undefined' : _typeof(url))) throw new Error('url must be a Fuzzyurl object');

  // infer protocol from port, and vice versa
  var urlProtocol = url.protocol || Protocols.getProtocol(url.port);
  var urlPort = url.port || Protocols.getPort(url.protocol);

  return {
    protocol: fuzzyMatch(mask.protocol, urlProtocol),
    username: fuzzyMatch(mask.username, url.username),
    password: fuzzyMatch(mask.password, url.password),
    hostname: fuzzyMatch(mask.hostname, url.hostname),
    port: fuzzyMatch(mask.port, urlPort),
    path: fuzzyMatch(mask.path, url.path),
    query: fuzzyMatch(mask.query, url.query),
    fragment: fuzzyMatch(mask.fragment, url.fragment)
  };
}

/**
 * If `mask` (which may contain * wildcards) matches `url` (which may not),
 * returns 1 if `mask` and `url` match perfectly, 0 if `mask` and `url`
 * are a wildcard match, or null otherwise.
 *
 * Wildcard language:
 *
 *     *              matches anything
 *     foo/*          matches "foo/" and "foo/bar/baz" but not "foo"
 *     foo/**         matches "foo/" and "foo/bar/baz" and "foo"
 *     *.example.com  matches "api.v1.example.com" but not "example.com"
 *     **.example.com matches "api.v1.example.com" and "example.com"
 *
 * Any other form is treated as a literal match.
 *
 * @param {string} mask  String mask to match with (may contain wildcards).
 * @param {string} value String value to match.
 * @returns {integer|null} 1 for perfect match, 0 for wildcard match, null otherwise.
 */
function fuzzyMatch(mask, value) {
  if (mask === "*") return 0;
  if (mask == value) return 1;
  if (!mask || !value) return null;

  if (mask.indexOf("**.") == 0) {
    var maskValue = mask.slice(3);
    if (value.endsWith('.' + maskValue)) return 0;
    if (maskValue === value) return 0;
    return null;
  }
  if (mask.indexOf("*") == 0) {
    if (value.endsWith(mask.slice(1))) return 0;
    return null;
  }

  // trailing wildcards are implemented more easily in reverse
  var revMask = strReverse(mask);
  var revValue = strReverse(value);

  if (revMask.indexOf("**/") == 0) {
    var revMaskValue = revMask.slice(3);
    if (revValue.endsWith('/' + revMaskValue)) return 0;
    if (revValue === revMaskValue) return 0;
    return null;
  }
  if (revMask.indexOf("*") == 0) {
    if (revValue.endsWith(revMask.slice(1))) return 0;
    return null;
  }

  return null;
}

// this implementation is from the internet and it is fast
function strReverse(str) {
  var rev = '';
  for (var i = str.length - 1; i >= 0; i--) {
    rev += str[i];
  }return rev;
}

/**
 * From a list of Fuzzyurl `masks`, returns the index of the one which best
 * matches `url`.  Returns null if none of `masks` match.
 *
 * @param {array} masks  Array of Fuzzyurl URL masks to match with.
 * @param {Fuzzyurl} url Fuzzyurl URL to match.
 * @returns {integer|null} Index of best matching mask, or null if none match.
 */
function bestMatchIndex(masks, url) {
  if ("object" !== (typeof url === 'undefined' ? 'undefined' : _typeof(url))) throw new Error('url must be a Fuzzyurl object');
  var bestIndex = null;
  var bestScore = -1;
  for (var i in masks) {
    var m = masks[i];
    if ("object" !== (typeof m === 'undefined' ? 'undefined' : _typeof(m))) throw new Error('Got a non-Fuzzyurl mask: ' + m);
    var score = match(m, url);
    if (score !== null && score > bestScore) {
      bestScore = score;
      bestIndex = parseInt(i);
    }
  }
  return bestIndex;
}

module.exports = { match: match, matches: matches, matchScores: matchScores, fuzzyMatch: fuzzyMatch, bestMatchIndex: bestMatchIndex };

},{"./protocols":3}],3:[function(require,module,exports){
/** @module fuzzyurl/protocols */

'use strict';

var portsByProtocol = {
  ssh: "22",
  http: "80",
  https: "443"
};

var protocolsByPort = {
  22: "ssh",
  80: "http",
  443: "https"
};

/**
 * Given a protocol, returns the (string-formatted) port number, or null
 * if not found.
 *
 * @param {string|null} protocol
 * @returns {string|null} port
 */
function getPort(protocol) {
  if (!protocol) return null;
  var baseProtocol = protocol.split("+").pop();
  return portsByProtocol[baseProtocol];
}

/**
 * Given a port number (string or integer), returns the protocol string,
 * or null if not found.
 *
 * @param {string|integer} port
 * @returns {string|null} protocol
 */
function getProtocol(port) {
  if (!port) return null;
  return protocolsByPort[port.toString()];
}

module.exports = { getPort: getPort, getProtocol: getProtocol };

},{}],4:[function(require,module,exports){
/** @module fuzzyurl/strings */

'use strict'

// This regex is a lot more readable in the Elixir and Ruby versions.
;
var regex = new RegExp('^' + '(?:(\\*|[a-zA-Z][A-Za-z+.-]+)://)?' + // m[1] is protocol
'(?:(\\*|[a-zA-Z0-9%_.!~*\'();&=+$,-]+)' + // m[2] is username
'(?::(\\*|[a-zA-Z0-9%_.!~*\'();&=+$,-]*))?' + // m[3] is password
'@)?' + '([a-zA-Z0-9\\.\\*\\-]+?)?' + // m[4] is hostname
'(?::(\\*|\\d+))?' + // m[5] is port
'(/[^\\?\\#]*)?' + // m[6] is path
'(?:\\?([^\\#]*))?' + // m[7] is query
'(?:\\#(.*))?' + // m[8] is fragment
'$');

/**
 * From a given string URL or URL mask, returns a generic object that
 * represents it.  Option `default` specifies the Fuzzyurl's default field
 * value; pass `default: "*"` to create a URL mask.
 *
 * @param {string} str The URL or URL mask to convert to a Fuzzyurl object.
 * @returns {object} Object representation of `str`.
 */
function fromString(str, options) {
  var opts = options || {};
  var defval = opts.default;

  if (typeof str !== "string") return null;
  var m = regex.exec(str, regex);
  if (!m) return null;
  return {
    protocol: m[1] || defval,
    username: m[2] || defval,
    password: m[3] || defval,
    hostname: m[4] || defval,
    port: m[5] || defval,
    path: m[6] || defval,
    query: m[7] || defval,
    fragment: m[8] || defval
  };
}

/**
 * Returns a string representation of the given Fuzzyurl object.
 *
 * @param {Fuzzyurl} fuzzyurl Fuzzyurl object to convert to string format.
 * @returns {string} String representation of `fuzzyurl`.
 */
function toString(fuzzyurl) {
  var out = '',
      f = fuzzyurl;
  if (f.protocol) out += f.protocol + '://';
  if (f.username) out += f.username;
  if (f.password) out += ':' + f.password;
  if (f.username) out += '@';
  if (f.hostname) out += f.hostname;
  if (f.port) out += ':' + f.port;
  if (f.path) out += f.path;
  if (f.query) out += '?' + f.query;
  if (f.fragment) out += '#' + f.fragment;
  return out;
}

module.exports = { fromString: fromString, toString: toString };

},{}]},{},[1])(1)
});
//# sourceMappingURL=fuzzyurl.js.map
