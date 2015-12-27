/** @module fuzzyurl */

'use strict';

let Strings = require("./strings");
let Match = require("./match");
let Protocols = require("./protocols");

const defaultFuzzyurl = {
  protocol: null,
  username: null,
  password: null,
  hostname: null,
  port: null,
  path: null,
  query: null,
  fragment: null
};
const fields = Object.keys(defaultFuzzyurl);

/**
 * Creates a Fuzzyurl object with the given parameter values.  Valid
 * `params` keys are: `protocol`, `username`, `password`, `hostname`,
 * `port`, `path`, `query`, and `fragment`; all default to null.
 *
 * @param {object} params Parameter values.
 *
 */
function Fuzzyurl(params) {
  let ps = Object.assign({}, defaultFuzzyurl, params || {});
  for (var p in ps) {
    if (defaultFuzzyurl.hasOwnProperty(p)) this[p] = ps[p];
    else throw new Error(`Bad Fuzzyurl parameter: ${p}`);
  }
};
module.exports = Fuzzyurl;

Fuzzyurl.prototype.equals = function (fu) {
  var equal = true;
  fields.forEach((f) => { if (this[f] != fu[f]) equal = false; });
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
  let ps = params || {};
  let f = new Fuzzyurl();
  fields.forEach((field) => {
    if (ps.hasOwnProperty(field)) f[field] = ps[field];
    else f[field] = this[field];
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
    fu = Fuzzyurl.fromString(params, {default: "*"});
  }
  else if (!params) {
    fu = {};
  }
  else if (typeof params == "object") {
    fu = params;
  }
  else {
    throw new Error("params must be string, object, or null");
  }

  var m = new Fuzzyurl(maskDefaults);
  Object.keys(fu).forEach((k) => {
    if (fu[k]) m[k] = fu[k];
  });
  return m;
};
const maskDefaults = {
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
module.exports.prototype.toString = function () { return Strings.toString(this); };


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
  var m = (typeof mask === "string") ? Strings.fromString(mask, {default: "*"}) : mask;
  var u = (typeof url === "string") ? Strings.fromString(url) : url;
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
  var m = (typeof mask === "string") ? Strings.fromString(mask, {default: "*"}) : mask;
  var u = (typeof url === "string") ? Strings.fromString(url) : url;
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
  var m = (typeof mask === "string") ? Strings.fromString(mask, {default: "*"}) : mask;
  var u = (typeof url === "string") ? Strings.fromString(url) : url;
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
}

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
  var ms = masks.map((m) => (typeof m === "string") ? Strings.fromString(m, {default: "*"}) : m );
  var u = (typeof url === "string") ? Strings.fromString(url) : url;
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
  let index = Fuzzyurl.bestMatchIndex(masks, url);
  return index && masks[index];
};

