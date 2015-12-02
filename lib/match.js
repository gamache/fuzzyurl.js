"use strict";

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
  if (mask === value) return 1;
  if (mask === null || value === null) return null;

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
 * From a list of Fuzzyurl `masks`, returns the one which best matches `url`.
 * Returns null if none of `masks` match.
 *
 * @param {array} masks  Array of Fuzzyurl URL masks to match with.
 * @param {Fuzzyurl} url Fuzzyurl URL to match.
 * @returns {Fuzzyurl|null} Best matching mask, or null if none match.
 */
function bestMatch(masks, url) {
  masks.map(function (mask) {
    return { mask: mask, score: match(mask, url) };
  }).filter(function (pair) {
    return pair.score !== null;
  }).sort(function (a, b) {
    return a.score > b.score;
  }).first.mask;
}

module.exports = { match: match, matches: matches, matchScores: matchScores, fuzzyMatch: fuzzyMatch, bestMatch: bestMatch };