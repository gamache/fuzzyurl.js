'use strict';

let assert = require('assert');
let Fuzzyurl = require('../src/fuzzyurl');


describe('Fuzzyurl.Match', () => {
  describe('fuzzyMatch', () => {
    let fuzzyMatch = Fuzzyurl.Match.fuzzyMatch;

    it('returns 0 for full wildcard', () => {
      assert(0 === fuzzyMatch("*", "lol"));
      assert(0 === fuzzyMatch("*", "*"));
      assert(0 === fuzzyMatch("*", null));
    });

    it('returns 1 for exact match', () => {
      assert(1 === fuzzyMatch("asdf", "asdf"));
    });

    it("handles *.example.com", () => {
      assert(0 === fuzzyMatch("*.example.com", "api.v1.example.com"));
      assert(null === fuzzyMatch("*.example.com", "example.com"));
    });

    it("handles **.example.com", () => {
      assert(0 === fuzzyMatch("**.example.com", "api.v1.example.com"));
      assert(0 === fuzzyMatch("**.example.com", "example.com"));
      assert(null === fuzzyMatch("**.example.com", "zzzexample.com"));
    });

    it("handles path/*", () => {
      assert(0 === fuzzyMatch("path/*", "path/a/b/c"));
      assert(null === fuzzyMatch("path/*", "path"));
    });

    it("handles path/**", () => {
      assert(0 === fuzzyMatch("path/**", "path/a/b/c"));
      assert(0 === fuzzyMatch("path/**", "path"));
      assert(null === fuzzyMatch("path/**", "pathzzz"));
    });

    it("returns null for bad matches with no wildcards", () => {
      assert(null === fuzzyMatch("asdf", "oh no"));
    });
  });


  describe('match', () => {
    let match = Fuzzyurl.Match.match;

    it("returns 0 for full wildcard", () => {
      assert(0 === match(Fuzzyurl.mask(), new Fuzzyurl()));
    });

    it("returns 8 for full exact match", () => {
      let fu = new Fuzzyurl({protocol: "a", username: "b", password: "c",
        hostname: "d", port: "e", path: "f", query: "g", protocol: "h"});
      assert(8 === match(fu, fu));
    });

    it("returns 1 for one exact match", () => {
      var mask = Fuzzyurl.mask(); mask.hostname = "example.com";
      let url = new Fuzzyurl({hostname: "example.com", protocol: "http",
                          path: "/index.pl", query: ""});
      assert(1 === match(mask, url));
    });

    it("infers protocol from port", () => {
      var mask = Fuzzyurl.mask(); mask.port = "80";
      var url = new Fuzzyurl({protocol: "http"});
      assert(1 === match(mask, url));
      url.port = "443";
      assert(null === match(mask, url));
    });

    it("infers port from protocol", () => {
      var mask = Fuzzyurl.mask(); mask.protocol = "https";
      var url = new Fuzzyurl({port: "443"});
      assert(1 === match(mask, url))
      url.protocol = "http";
      assert(null === match(mask, url));
    });
  });

  describe('matches', () => {
    let matches = Fuzzyurl.Match.matches;

    it('returns true on matches', () => {
      assert(true === matches(Fuzzyurl.mask(), new Fuzzyurl()));
    });

    it('returns false on non-matches', () => {
      var mask = Fuzzyurl.mask(); mask.port = "666";
      assert(false === matches(mask, new Fuzzyurl()));
    });
  });

  describe('matchScores', () => {
    let matchScores = Fuzzyurl.Match.matchScores;

    it('returns all zeroes for full wildcard', () => {
      let scores = matchScores(Fuzzyurl.mask(), new Fuzzyurl());
      assert(8 === Object.keys(scores).length);

      let scoreValues = Object.keys(scores).map((k) => scores[k]);
      let nonzeroScores = scoreValues.filter((s) => s != 0);
      assert(0 === nonzeroScores.length);
    });
  });

  describe('bestMatch', () => {
    let bestMatch = Fuzzyurl.Match.bestMatch;

    it('returns the best match index', () => {
      let best = Fuzzyurl.mask({hostname: "example.com", port: "8888"});
      let mask = Fuzzyurl.mask();
      let url = new Fuzzyurl({hostname: "example.com", port: "8888", protocol: "http"});
      assert(0 === bestMatch([best, mask], url));
      assert(null === bestMatch([], url));
    });
  });

});
