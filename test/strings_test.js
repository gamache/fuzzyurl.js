'use strict';

let assert = require('assert');
let Fuzzyurl = require('../src/fuzzyurl');

describe('Fuzzyurl.Strings', () => {
  describe('fromString', () => {
    let fromString = Fuzzyurl.Strings.fromString;

    it('handles simple URLs', () => {
      assert(null !== fromString("http://example.com"));
      assert(null !== fromString("ssh://user:pass@host"));
      assert(null !== fromString("https://example.com:443/omg/lol"));
    });

    it('rejects bullshit', () => {
      assert(null === fromString(null));
      assert(null === fromString(22));
    });

    it('handles rich URLs', () => {
      let fu = fromString("http://user_1:pass%20word@foo.example.com:8000/some/path?awesome=true&encoding=ebcdic#/hi/mom");
      assert(null !== fu);
      assert("http" === fu.protocol);
      assert("user_1" === fu.username);
      assert("pass%20word" === fu.password);
      assert("foo.example.com" === fu.hostname);
      assert("8000" === fu.port);
      assert("/some/path" === fu.path);
      assert("awesome=true&encoding=ebcdic" === fu.query);
      assert("/hi/mom" === fu.fragment);
    });
  });

  describe('toString', () => {
    let toString = Fuzzyurl.Strings.toString;

    it('handles simple URLs', () => {
      assert("example.com" === toString(new Fuzzyurl({hostname: "example.com"})));
      assert("http://example.com" === toString(new Fuzzyurl({
        hostname: "example.com", protocol: "http"})));
      assert("http://example.com/oh/yeah" === toString(new Fuzzyurl({
        hostname: "example.com", protocol: "http", path: "/oh/yeah"})));
    });

    it('handles rich URLs', () => {
      let fu = new Fuzzyurl({
        protocol: "https",
        username: "u",
        password: "p",
        hostname: "api.example.com",
        port: "443",
        path: "/secret/endpoint",
        query: "admin=true",
        fragment: "index"
      });
      assert(toString(fu) ===
        "https://u:p@api.example.com:443/secret/endpoint?admin=true#index");
    });
  });
});

