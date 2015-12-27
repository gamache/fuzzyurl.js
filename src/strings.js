/** @module fuzzyurl/strings */

'use strict';

// This regex is a lot more readable in the Elixir and Ruby versions.
const regex = new RegExp(
  '^' +
  '(?:(\\*|[a-zA-Z][A-Za-z+.-]+)://)?' +        // m[1] is protocol
  '(?:(\\*|[a-zA-Z0-9%_.!~*\'();&=+$,-]+)' +    // m[2] is username
  '(?::(\\*|[a-zA-Z0-9%_.!~*\'();&=+$,-]*))?' + // m[3] is password
  '@)?' +
  '([a-zA-Z0-9\\.\\*\\-]+?)?' +                 // m[4] is hostname
  '(?::(\\*|\\d+))?' +                          // m[5] is port
  '(/[^\\?\\#]*)?' +                            // m[6] is path
  '(?:\\?([^\\#]*))?' +                         // m[7] is query
  '(?:\\#(.*))?' +                              // m[8] is fragment
  '$'
);

/**
 * From a given string URL or URL mask, returns a generic object that
 * represents it.  Option `default` specifies the Fuzzyurl's default field
 * value; pass `default: "*"` to create a URL mask.
 *
 * @param {string} str The URL or URL mask to convert to a Fuzzyurl object.
 * @returns {object} Object representation of `str`.
 */
function fromString(str, options) {
  let opts = options || {};
  let defval = opts.default;

  if (typeof str !== "string") return null;
  let m = regex.exec(str, regex);
  if (!m) return null;
  return {
    protocol: m[1] || defval,
    username: m[2] || defval,
    password: m[3] || defval,
    hostname: m[4] || defval,
    port:     m[5] || defval,
    path:     m[6] || defval,
    query:    m[7] || defval,
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
  var out = '', f = fuzzyurl;
  if (f.protocol) out += `${f.protocol}://`;
  if (f.username) out += f.username;
  if (f.password) out += `:${f.password}`;
  if (f.username) out += `@`;
  if (f.hostname) out += f.hostname;
  if (f.port)     out += `:${f.port}`;
  if (f.path)     out += f.path;
  if (f.query)    out += `?${f.query}`;
  if (f.fragment) out += `#${f.fragment}`;
  return out;
}

module.exports = { fromString, toString };

