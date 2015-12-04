let Fuzzyurl = require("./constructor");
let Strings = Fuzzyurl.Strings = require("./strings");
let Match = Fuzzyurl.Match = require("./match");
let Protocols = Fuzzyurl.Protocols = require("./protocols");

Fuzzyurl.mask = function mask() {
  return new Fuzzyurl({
    protocol: "*", username: "*", password: "*", hostname: "*",
    port: "*", path: "*", query: "*", fragment: "*"
  });
};

Fuzzyurl.toString = function toString(fuzzyurl) {
  return Strings.toString(fuzzyurl);
};

Fuzzyurl.fromString = function fromString(string) {
  return Strings.fromString(string);
};

Fuzzyurl.match = function match(mask, url) {
  var m = (typeof mask === "string") ? fromString(mask) : mask;
  var u = (typeof url === "string") ? fromString(url) : url;
  return Match.match(m, u);
};

Fuzzyurl.matches = function matches(mask, url) {
  var m = (typeof mask === "string") ? fromString(mask) : mask;
  var u = (typeof url === "string") ? fromString(url) : url;
  return Match.matches(m, u);
};

Fuzzyurl.matchScores = function matchScores(mask, url) {
  var m = (typeof mask === "string") ? fromString(mask) : mask;
  var u = (typeof url === "string") ? fromString(url) : url;
  return Match.matchScores(m, u);
};

Fuzzyurl.bestMatch = function bestMatch(masks, url) {
  var ms = masks.map((m) => {
    (typeof m === "string") ? fromString(m) : m
  });
  var u = (typeof url === "string") ? fromString(url) : url;
  return Match.bestMatch(ms, u);
};


module.exports = Fuzzyurl;

