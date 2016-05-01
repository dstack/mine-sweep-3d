import Coords from '../src/Coords';

import chai from 'chai';
chai.should();
var expect = chai.expect;

var assert = require('chai').assert;
describe('Coords', function() {

  describe('constructor()', function () {
    it('should allow construction', function () {
      var nc = new Coords(1,2,3);
      expect(nc).to.be.a('object');
      expect(nc).to.exist;
      expect(nc).to.be.instanceof(Coords);
    });
    it('should contain correct properties', function () {
      var nc = new Coords(1,2,3);
      expect(nc.x).to.exist;
      expect(nc.x).to.equal(1);
      expect(nc.y).to.exist;
      expect(nc.y).to.equal(2);
      expect(nc.z).to.exist;
      expect(nc.z).to.equal(3);
    });
  });

  describe('toStr()', function(){
    it('should be a function', function(){
      var nc = new Coords(1,2,3);
      expect(nc.toStr).to.be.a('function');
    });
    it('should return a string', function(){
      var nc = new Coords(1,2,3);
      expect(nc.toStr()).to.be.a('string');
    });
    it('should output correctly', function(){
      var x = Math.floor(Math.random()*5),
        y = Math.floor(Math.random()*5),
        z = Math.floor(Math.random()*5);
      var nc = new Coords(x,y,z);
      expect(nc.toStr()).to.equal(`${x},${y},${z}`);
    });
  });

  describe('toCellName()', function(){
    it('should be a function', function(){
      var nc = new Coords(1,2,3);
      expect(nc.toCellName).to.be.a('function');
    });
    it('should return a string', function(){
      var nc = new Coords(1,2,3);
      expect(nc.toCellName()).to.be.a('string');
    });
    it('should output correctly', function(){
      var x = Math.floor(Math.random()*5),
        y = Math.floor(Math.random()*5),
        z = Math.floor(Math.random()*5);
      var nc = new Coords(x,y,z);
      expect(nc.toCellName()).to.equal(`cell-${x},${y},${z}`);
    });
  });

  describe('isEqual()', function(){
    it('should be a function', function(){
      var nc = new Coords(1,2,3);
      expect(nc.isEqual).to.be.a('function');
    });
    it('should return a boolean', function(){
      var nc = new Coords(1,2,3);
      expect(nc.isEqual({x:0, y:0, z:0})).to.be.a('boolean');
    });
    it('should output correctly', function(){
      var x = Math.floor(Math.random()*5),
        y = Math.floor(Math.random()*5),
        z = Math.floor(Math.random()*5);
      var nc = new Coords(x,y,z),
        nc2 = new Coords(x,y,z),
        nc3 = new Coords(x-1,y+2,z-3);
      expect(nc.isEqual(nc2)).to.equal(true);
      expect(nc.isEqual(nc3)).to.equal(false);
    });
  });
});
