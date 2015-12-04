'use strict';

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
    if (defaultFuzzyurl.hasOwnProperty(p)) this[p] = ps[p];else throw new Error('Bad Fuzzyurl parameter: ' + p);
  }
};

Fuzzyurl.prototype.equals = function (fu) {
  var _this = this;

  var equal = true;
  fields.forEach(function (f) {
    if (_this[f] != fu[f]) equal = false;
  });
  return equal;
};

module.exports = Fuzzyurl;