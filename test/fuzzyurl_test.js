'use strict';

let assert = require('assert');
let Fuzzyurl = require('../src/fuzzyurl');

describe('Fuzzyurl', () => {
  describe('prototype.equals', () => {
    it('works for equality', () => {
      let fu1 = new Fuzzyurl({hostname: "example.com"});
      let fu2 = new Fuzzyurl({hostname: "example.com"});
      assert(fu1.equals(fu2));
      assert(fu2.equals(fu1));
    });

    it('works for inequality', () => {
      let fu1 = new Fuzzyurl({hostname: "badexample.com"});
      let fu2 = new Fuzzyurl({port: "2222"});
      assert(!fu1.equals(fu2));
      assert(!fu2.equals(fu1));
    });
  });

  describe('mask', () => {
    it('returns blank mask when given no args', () => {
      let mask = Fuzzyurl.mask();
      let fu = new Fuzzyurl({
        protocol: "*",
        username: "*",
        password: "*",
        hostname: "*",
        port: "*",
        path: "*",
        query: "*",
        fragment: "*"
      });
      assert(mask.equals(fu));
    });

    it('returns correct mask when given object args', () => {
      let mask = Fuzzyurl.mask({hostname: "example.com", port: "80"});
      let fu = new Fuzzyurl({
        protocol: "*",
        username: "*",
        password: "*",
        hostname: "example.com",
        port: "80",
        path: "*",
        query: "*",
        fragment: "*"
      });
      assert(mask.equals(fu));
    });

    it('returns correct mask when given string args', () => {
      let mask = Fuzzyurl.mask("example.com:80");
      let fu = new Fuzzyurl({
        protocol: "*",
        username: "*",
        password: "*",
        hostname: "example.com",
        port: "80",
        path: "*",
        query: "*",
        fragment: "*"
      });
      assert(mask.equals(fu));
    });
  });

  describe('toString', () => {
    it('creates string from Fuzzyurl', () => {
      let fu = new Fuzzyurl({protocol: "http", hostname: "example.com", path: "/index.html"});
      assert.equal("http://example.com/index.html", Fuzzyurl.toString(fu));
    });
  });

  describe('prototype.toString', () => {
    it('creates string from Fuzzyurl', () => {
      let fu = new Fuzzyurl({protocol: "http", hostname: "example.com", path: "/index.html"});
      assert.equal("http://example.com/index.html", fu.toString());
    });
  });

  describe('fromString', () => {
    it('creates Fuzzyurl from string', () => {
      let fu = new Fuzzyurl({protocol: "http", hostname: "example.com", path: "/index.html"});
      assert(fu.equals(Fuzzyurl.fromString("http://example.com/index.html")));
    });
  });

  describe('match', () => {
    it('is delegated', () => {
      assert.equal(0, Fuzzyurl.match(Fuzzyurl.mask(), new Fuzzyurl()));
    });
  });

  describe('matches', () => {
    it('is delegated', () => {
      assert.equal(true, Fuzzyurl.matches(Fuzzyurl.mask(), new Fuzzyurl()));
    });
  });

  describe('matchScores', () => {
    it('is delegated', () => {
      assert.equal("object", typeof Fuzzyurl.matchScores(Fuzzyurl.mask(), new Fuzzyurl()));
    });
  });

  describe('fuzzyMatch', () => {
    it('is delegated', () => {
      assert.equal(0, Fuzzyurl.fuzzyMatch("*", "ofelia"));
    });
  });

  describe('bestMatchIndex', () => {
    it('is delegated', () => {
      let masks = [ Fuzzyurl.mask(), "asdfasdf" ];
      assert.equal(0, Fuzzyurl.bestMatchIndex(masks, new Fuzzyurl()));
    });
  });

  describe('bestMatch', () => {
    it('returns the given data, not intermediate Fuzzyurl objects', () => {
      assert.equal("example.com/*", Fuzzyurl.bestMatch(
        [Fuzzyurl.mask(), "example.com/*", "nope"], "http://example.com/omg/"));
    });
  });
});
