'use strict';

let assert = require('assert');
let Fuzzyurl = require('../src/fuzzyurl');

describe('Fuzzyurl.Protocols', () => {
  describe('getPort', () => {
    it('gets port by protocol', () => {
      let getPort = Fuzzyurl.Protocols.getPort;

      assert("80" === getPort("http"));
      assert("22" === getPort("ssh"));
      assert("22" === getPort("git+ssh"));
      assert(null === getPort(null));
    });
  });

  describe('getProtocol', () => {
    it('gets protocol by port', () => {
      let getProtocol = Fuzzyurl.Protocols.getProtocol;

      assert("http" === getProtocol("80"));
      assert("http" === getProtocol(80));
      assert(null === getProtocol(null));
    });
  });
});

