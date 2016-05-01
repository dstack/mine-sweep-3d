import Coords from '../src/Coords';
import Board from '../src/Board';

import chai from 'chai';
chai.should();
var expect = chai.expect;

// with key 'hello world', board will init with bombs at (first 5):
// 0,0,2
// 0,2,1
// 0,2,2
// 1,2,3
// 2,2,0

// supress warnings, because we create them on purpose here
console.warn = function(){}

var matches = [
  new Coords(0,0,0).toStr(),
  new Coords(0,0,1).toStr(),
  new Coords(0,0,2).toStr(),
  new Coords(0,1,0).toStr(),
  new Coords(0,1,1).toStr(),
  new Coords(0,1,2).toStr(),
  new Coords(0,2,0).toStr(),
  new Coords(0,2,1).toStr(),
  new Coords(0,2,2).toStr(),
  new Coords(1,0,0).toStr(),
  new Coords(1,0,1).toStr(),
  new Coords(1,0,2).toStr(),
  new Coords(1,1,0).toStr(),
  new Coords(1,1,2).toStr(),
  new Coords(1,2,0).toStr(),
  new Coords(1,2,1).toStr(),
  new Coords(1,2,2).toStr(),
  new Coords(2,0,0).toStr(),
  new Coords(2,0,1).toStr(),
  new Coords(2,0,2).toStr(),
  new Coords(2,1,0).toStr(),
  new Coords(2,1,1).toStr(),
  new Coords(2,1,2).toStr(),
  new Coords(2,2,0).toStr(),
  new Coords(2,2,1).toStr(),
  new Coords(2,2,2).toStr()
];


var assert = require('chai').assert;
describe('Board', function() {
  describe('constructor()', function () {
    it('should create correct totals', function () {
      var total = Math.pow(4, 3);
      var nb = new Board(4, 0);
      expect(nb.totalCells).to.equal(total);
    });
    it('should create correct total of cells', function () {
      var total = Math.pow(4, 3);
      var nb = new Board(4, 0);
      nb.init('hello world');
      expect(nb.cells.size).to.equal(total);
    });
  });

  describe('init()', function(){
    it('should be a function', function(){
      var nb = new Board(3,0);
      expect(nb.init).to.be.a('function');
    });
    it('should create correct number of bombs, if less than 75%', function(){
      var totalBombs = 5,
        nb = new Board(4, totalBombs);
      nb.init('hello world');
      var bombCount = 0;
      nb.cells.forEach((cell) => {
        if(cell.isBomb){
          bombCount++;
        }
      });
      expect(bombCount).to.equal(totalBombs);
    });
    it('should reduce number of bombs, if greater than 75%', function(){
      var totalBombs = 27,
        nb = new Board(3, totalBombs),
        actualExpected = Math.floor(27*0.75);
      nb.init('hello world');
      var bombCount = 0;
      nb.cells.forEach((cell) => {
        if(cell.isBomb){
          bombCount++;
        }
      });
      expect(bombCount).to.not.equal(totalBombs);
      expect(bombCount).to.equal(actualExpected);
    });
    it('should predictably pick based on hash', function(){
      var totalBombs = 5,
        nb = new Board(4, totalBombs);
      nb.init('hello world');
      var cell = nb.cells.get(nb.cellNameMap[new Coords(0,0,2).toCellName()]);
      expect(cell.isBomb).to.equal(true);
      cell = nb.cells.get(nb.cellNameMap[new Coords(0,2,1).toCellName()]);
      expect(cell.isBomb).to.equal(true);
      cell = nb.cells.get(nb.cellNameMap[new Coords(0,2,2).toCellName()]);
      expect(cell.isBomb).to.equal(true);
      cell = nb.cells.get(nb.cellNameMap[new Coords(1,2,3).toCellName()]);
      expect(cell.isBomb).to.equal(true);
      cell = nb.cells.get(nb.cellNameMap[new Coords(2,2,0).toCellName()]);
      expect(cell.isBomb).to.equal(true);
    });
  });

  describe('destroy()', function(){
    it('should be a function', function(){
      var nb = new Board(3,0);
      expect(nb.destroy).to.be.a('function');
    });
    it('should remove all properties', function(){
      var nb = new Board(3,0);
      nb.destroy();
      expect(nb.totalCells).to.not.exist;
      expect(nb.cells).to.not.exist;
      expect(nb.cellNameMap).to.not.exist;
      expect(nb.sideLen).to.not.exist;
    });
  });

  describe('getAdjascentCellCoords()', function(){
    it('should be a function', function(){
      var nb = new Board(3,0);
      expect(nb.getAdjascentCellCoords).to.be.a('function');
    });
    it('should return correct cell coords', function(){
      var nb = new Board(3,0);
      nb.init('hello world');
      var coordsList = nb.getAdjascentCellCoords(nb.cellNameMap[new Coords(1,1,1).toCellName()]);
      coordsList = coordsList.map(function(coords){
        return coords.toStr();
      });
      matches.forEach(function(match){
        expect(coordsList).to.contain(match);
      });
    })
  });

  describe('checkVictoryConditions()', function(){
    it('should be a function', function(){
      var nb = new Board(2,0);
      expect(nb.checkVictoryConditions).to.be.a('function');
    });
    it('should return true if there are no cells', function(){
      // a blank coard would technically have a victory on it
      var nb = new Board(2,0);
      expect(nb.checkVictoryConditions()).to.equal(true);
    });
    it('should return true if all bombs are marked', function(){
      // a blank coard would technically have a victory on it
      var nb = new Board(2,1);
      nb.init();
      var removables = [];
      nb.cells.forEach(function(cell){
        if(cell.isBomb){
          cell.marked = true;
        }
        else{
          removables.push(cell.coords);
        }
      });
      removables.forEach(function(coords){
        nb.cells.delete(coords);
      });
      expect(nb.cells.size).to.equal(1);
      expect(nb.checkVictoryConditions()).to.equal(true);
    });
    it('should return false if all bombs are not marked', function(){
      // a blank coard would technically have a victory on it
      var nb = new Board(2,1);
      nb.init();
      var removables = [];
      nb.cells.forEach(function(cell){
        if(!cell.isBomb){
          removables.push(cell.coords);
        }
      });
      removables.forEach(function(coords){
        nb.cells.delete(coords);
      });
      expect(nb.cells.size).to.equal(1);
      expect(nb.checkVictoryConditions()).to.equal(false);
    });
  });

  describe('getAdjascentCells()', function(){
    it('should be a function', function(){
      var nb = new Board(3,0);
      expect(nb.getAdjascentCells).to.be.a('function');
    });
    it('should return correct cells', function(){
      var nb = new Board(3,0);
      nb.init('hello world');
      var cellList = nb.getAdjascentCells(nb.cellNameMap[new Coords(1,1,1).toCellName()]);
      cellList = cellList.map(function(cell){
        return cell.coords.toStr();
      });
      matches.forEach(function(match){
        expect(cellList).to.contain(match);
      });
    })
  });

  describe('incBombCount()', function(){
    it('should be a function', function(){
      var nb = new Board(3,0);
      expect(nb.incBombCount).to.be.a('function');
    });
    it('should increment count on cells', function(){
      var nb = new Board(3,0);
      nb.init('hello world');
      var centerCell = nb.cells.get(nb.cellNameMap[new Coords(1,1,1).toCellName()]);
      centerCell.isBomb = true;
      nb.incBombCount(nb.cellNameMap[new Coords(1,1,1).toCellName()]);
      var testCell = nb.cells.get(nb.cellNameMap[new Coords(0,0,0).toCellName()]);
      expect(testCell.count).to.equal(1);
    });
  });
});
