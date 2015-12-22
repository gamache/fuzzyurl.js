'use strict';

let Fuzzyurl = require("./constructor");
let Strings = Fuzzyurl.Strings = require("./strings");
let Match = Fuzzyurl.Match = require("./match");
let Protocols = Fuzzyurl.Protocols = require("./protocols");

const maskDefaults = {
  protocol: "*", username: "*", password: "*", hostname: "*",
  port: "*", path: "*", query: "*", fragment: "*"
};

function mask(params) {
  var fu;
  if (typeof params == "string") {
    fu = Fuzzyurl.fromString(params, "*");
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

function toString(fuzzyurl) {
  return Strings.toString(fuzzyurl);
};


function fromString(string) {
  return Strings.fromString(string);
};

function match(mask, url) {
  var m = (typeof mask === "string") ? Strings.fromString(mask, "*") : mask;
  var u = (typeof url === "string") ? Strings.fromString(url) : url;
  return Match.match(m, u);
};

function matches(mask, url) {
  var m = (typeof mask === "string") ? Strings.fromString(mask, "*") : mask;
  var u = (typeof url === "string") ? Strings.fromString(url) : url;
  return Match.matches(m, u);
};

function matchScores(mask, url) {
  var m = (typeof mask === "string") ? Strings.fromString(mask, "*") : mask;
  var u = (typeof url === "string") ? Strings.fromString(url) : url;
  return Match.matchScores(m, u);
};

function bestMatchIndex(masks, url) {
  var ms = masks.map((m) => (typeof m === "string") ? Strings.fromString(m, "*") : m );
  var u = (typeof url === "string") ? Strings.fromString(url) : url;
  return Match.bestMatchIndex(ms, u);
};

function bestMatch(masks, url) {
  let index = bestMatchIndex(masks, url);
  if (index === null) return null;
  return masks[index];
};


Fuzzyurl.match = match;
Fuzzyurl.matches = matches;
Fuzzyurl.matchScores = matchScores;
Fuzzyurl.bestMatchIndex = bestMatchIndex;
Fuzzyurl.bestMatch = bestMatch;
Fuzzyurl.mask = mask;
Fuzzyurl.fromString = fromString;
Fuzzyurl.toString = toString;
Fuzzyurl.prototype.toString = function () { return Strings.toString(this); };

module.exports = Fuzzyurl;

