import Cell from '../src/Cell';
import Coords from '../src/Coords';

import chai from 'chai';
chai.should();
var expect = chai.expect;

var assert = require('chai').assert;
describe('Cell', function() {
  describe('constructor()', function () {
    it('should allow long form construction', function () {
      var nc = new Cell(1,2,3);
      expect(nc).to.be.a('object');
      expect(nc.pos).to.be.a('object');
      expect(nc.x).to.equal(1);
      expect(nc.y).to.equal(2);
      expect(nc.z).to.equal(3);
    });

    it('should allow short form construction', function () {
      var coords = new Coords(1,2,3),
        nc = new Cell(coords);
      expect(nc).to.be.a('object');
      expect(nc.pos).to.be.a('object');
      expect(nc.x).to.equal(1);
      expect(nc.y).to.equal(2);
      expect(nc.z).to.equal(3);
    });

    it('should initialize with no markers', function () {
      var coords = new Coords(1,2,3),
        nc = new Cell(coords);
      expect(nc).to.be.a('object');
      expect(nc.pos).to.be.a('object');
      expect(nc.marked).to.equal(false);
    });
  });
});
