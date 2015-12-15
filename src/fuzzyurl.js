'use strict';

let Fuzzyurl = require("./constructor");
let Strings = Fuzzyurl.Strings = require("./strings");
let Match = Fuzzyurl.Match = require("./match");
let Protocols = Fuzzyurl.Protocols = require("./protocols");

const maskDefaults = {
  protocol: "*", username: "*", password: "*", hostname: "*",
  port: "*", path: "*", query: "*", fragment: "*"
};
Fuzzyurl.mask = function mask(params) {
  var m = new Fuzzyurl(maskDefaults);
  var fu;
  if (typeof params == "string") {
    fu = Fuzzyurl.fromString(params);
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

  Object.keys(fu).forEach((k) => {
    if (fu[k]) m[k] = fu[k];
  });
  return m;
};

Fuzzyurl.toString = function toString(fuzzyurl) {
  return Strings.toString(fuzzyurl);
};

Fuzzyurl.prototype.toString = function () { return Strings.toString(this); };

Fuzzyurl.fromString = function fromString(string) {
  return Strings.fromString(string);
};

Fuzzyurl.match = function match(mask, url) {
  var m = (typeof mask === "string") ? Strings.fromString(mask) : mask;
  var u = (typeof url === "string") ? Strings.fromString(url) : url;
  return Match.match(m, u);
};

Fuzzyurl.matches = function matches(mask, url) {
  var m = (typeof mask === "string") ? Strings.fromString(mask) : mask;
  var u = (typeof url === "string") ? Strings.fromString(url) : url;
  return Match.matches(m, u);
};

Fuzzyurl.matchScores = function matchScores(mask, url) {
  var m = (typeof mask === "string") ? Strings.fromString(mask) : mask;
  var u = (typeof url === "string") ? Strings.fromString(url) : url;
  return Match.matchScores(m, u);
};

Fuzzyurl.bestMatch = function bestMatch(masks, url) {
  var ms = masks.map((m) => (typeof m === "string") ? Strings.fromString(m) : m );
  var u = (typeof url === "string") ? Strings.fromString(url) : url;
  return Match.bestMatch(ms, u);
};

module.exports = Fuzzyurl;

