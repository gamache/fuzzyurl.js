'use strict';

let assert = require('chai').assert;
let Fuzzyurl = require('../src/fuzzyurl');
let matches = require('./matches');

describe('URL test suite', () => {
  describe('positive matches', () => {
    matches.positive_matches.forEach((pair) => {
      it(`'${pair[0]}' matches '${pair[1]}'`, () => {
        let mask = Fuzzyurl.mask(pair[0]);
        assert(Fuzzyurl.matches(mask, pair[1]));
      });
    });
  });

  describe('negative matches', () => {
    matches.negative_matches.forEach((pair) => {
      it(`'${pair[0]}' doesn't match '${pair[1]}'`, () => {
        let mask = Fuzzyurl.mask(pair[0]);
        assert(!Fuzzyurl.matches(mask, pair[1]));
      });
    });
  });
});

