'use strict';

var Fuzzyurl = require("./constructor");
var Strings = Fuzzyurl.Strings = require("./strings");
var Match = Fuzzyurl.Match = require("./match");
var Protocols = Fuzzyurl.Protocols = require("./protocols");

var maskDefaults = {
  protocol: "*", username: "*", password: "*", hostname: "*",
  port: "*", path: "*", query: "*", fragment: "*"
};
Fuzzyurl.mask = function mask(params) {
  var ps = params || {};
  return new Fuzzyurl(Object.assign({}, maskDefaults, params));
};

Fuzzyurl.toString = function toString(fuzzyurl) {
  return Strings.toString(fuzzyurl);
};

Fuzzyurl.prototype.toString = function () {
  return Strings.toString(this);
};

Fuzzyurl.fromString = function fromString(string) {
  return Strings.fromString(string);
};

Fuzzyurl.match = function match(mask, url) {
  var m = typeof mask === "string" ? Strings.fromString(mask) : mask;
  var u = typeof url === "string" ? Strings.fromString(url) : url;
  return Match.match(m, u);
};

Fuzzyurl.matches = function matches(mask, url) {
  var m = typeof mask === "string" ? Strings.fromString(mask) : mask;
  var u = typeof url === "string" ? Strings.fromString(url) : url;
  return Match.matches(m, u);
};

Fuzzyurl.matchScores = function matchScores(mask, url) {
  var m = typeof mask === "string" ? Strings.fromString(mask) : mask;
  var u = typeof url === "string" ? Strings.fromString(url) : url;
  return Match.matchScores(m, u);
};

Fuzzyurl.bestMatch = function bestMatch(masks, url) {
  var ms = masks.map(function (m) {
    return typeof m === "string" ? Strings.fromString(m) : m;
  });
  var u = typeof url === "string" ? Strings.fromString(url) : url;
  return Match.bestMatch(ms, u);
};

module.exports = Fuzzyurl;