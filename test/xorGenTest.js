import XorGen128 from '../src/XorGen128';

import chai from 'chai';
chai.should();
var expect = chai.expect;

describe('XorGen128', function() {
  describe('constructor()', function () {
    it('should construct with a string seed', function(){
      var xg = new XorGen128('hello');
      expect(xg.prng).to.exist;
    });
    it('should construct with an int seed', function(){
      var xg = new XorGen128(999);
      expect(xg.prng).to.exist;
    });
    it('should construct with no seed', function(){
      var xg = new XorGen128();
      expect(xg.prng).to.exist;
    });
  });

  describe('prng()', function(){
    it('should produce predictable results if the seed is known', function(){
      var control = [],
        check = [],
        noMatch = [],
        xg1 = new XorGen128('control'),
        xg2 = new XorGen128('control'),
        xg3 = new XorGen128('not-control');

      for(var i=0; i<3; i++){
        control.push(xg1.prng());
        check.push(xg2.prng());
        noMatch.push(xg3.prng());
      }

      expect(control.join(',')).to.equal(check.join(','));
      expect(check.join(',')).to.not.equal(noMatch.join(','));
    })
  });
});
