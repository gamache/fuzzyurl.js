"use strict";

var FIELDS = ["protocol", "username", "password", "hostname", "port", "path", "query", "fragment"];

/**
 * Creates a Fuzzyurl object with the given parameter values.  Valid
 * `params` keys are: `protocol`, `username`, `password`, `hostname`,
 * `port`, `path`, `query`, and `fragment`; all default to null.
 *
 * @param {object} params Parameter values.
 *
 */
function Fuzzyurl(params) {
  var _this = this;

  FIELDS.forEach(function (f) {
    return _this[f] = null;
  }); // initialize
  var ps = params ? params : {};
  Object.keys(ps).forEach(function (k) {
    if (-1 === FIELDS.indexOf(k)) throw new Error("Got bad field " + k + ".");
    _this[k] = ps[k];
  });
};

module.exports = Fuzzyurl;