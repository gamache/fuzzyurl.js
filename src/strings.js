'use strict';

let Fuzzyurl = require('./constructor');

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

function fromString(str, default_value) {
  if (typeof str !== "string") return null;
  let m = regex.exec(str, regex);
  if (!m) return null;
  let fu = new Fuzzyurl({
    protocol: m[1] || default_value,
    username: m[2] || default_value,
    password: m[3] || default_value,
    hostname: m[4] || default_value,
    port:     m[5] || default_value,
    path:     m[6] || default_value,
    query:    m[7] || default_value,
    fragment: m[8] || default_value
  });
  return fu;
}

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

