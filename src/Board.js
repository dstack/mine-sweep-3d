import {uniqArray, range} from './Util';
import Coords from './Coords';
import Cell from './Cell';
import XorGen128 from './XorGen128';

export default class Board {
  constructor(dim, bombCount){
    //setup rules around max bombs per board
    this.totalCells = Math.pow(dim, 3);
    this.cells = new Map();
    this.cellNameMap = {};
    this.sideLen = dim;
    if(bombCount > this.totalCells * 0.75){
      console.warn('too many bombs');
      bombCount = Math.floor(this.totalCells * 0.75);
      console.warn(`using ${bombCount} bombs instead`);
    }
    this.bombs = bombCount;
  }

  destroy(){
    for(var p in this){
      this[p] = null;
    }
    return;
  }

  checkVictoryConditions(){
    var countNotBombNotMarked = 0;
    this.cells.forEach((cell) => {
      if(!cell.isBomb){
        countNotBombNotMarked++;
      }
      else if(cell.isBomb && !cell.marked){
        countNotBombNotMarked++;
      }
    });
    return countNotBombNotMarked == 0;
  }

  init(seed){
    // use seed to generate random bomb positions to match bombcount
    var xg = new XorGen128(seed),
      bombIs = [];
    var bombRange = range(0, this.totalCells);
    for(var k=0; k<this.bombs; k++){
      var rndIndex = Math.floor(xg.prng()*bombRange.length);
      bombIs.push(bombRange.splice(rndIndex, 1)[0]);
    }
    // generate all cells
    var cx = 0, cy = 0, cz = 0, bombCoords = [];
    for(var i=0; i< this.totalCells; i++){
      var newCoords = new Coords(cx,cy,cz),
        isBomb = bombIs.indexOf(i) > -1;
      this.cells.set(newCoords, new Cell(newCoords, isBomb));
      this.cellNameMap[newCoords.toCellName()] = newCoords;
      if(isBomb){
        bombCoords.push(newCoords);
      }
      if(cz < this.sideLen - 1){
        cz++;
      }
      else{
        cz = 0;
        cy++;
      }
      if(cy == this.sideLen){
        cy = 0;
        cx++;
      }
    }
    // pre-gen counts for bombs
    bombCoords.forEach((bCoords) => {
      this.incBombCount(bCoords);
    });
  }

  getAdjascentCells(coords){
    // generate potential x, y, and z positions
    let xs = uniqArray([Math.max(coords.x - 1, 0), coords.x, Math.min(coords.x + 1, this.sideLen)]);
    let ys = uniqArray([Math.max(coords.y - 1, 0), coords.y, Math.min(coords.y + 1, this.sideLen)]);
    let zs = uniqArray([Math.max(coords.z - 1, 0), coords.z, Math.min(coords.z + 1, this.sideLen)]);
    let adjs = [];
    // permute
    xs.forEach((x) => {
      ys.forEach((y) => {
        zs.forEach((z) => {
          let adjCoords = this.cellNameMap[new Coords(x,y,z).toCellName()];
          // if it exists, is not the starting coords, and we found it
          if(adjCoords && !coords.isEqual(adjCoords) && this.cells.has(adjCoords)){
            adjs.push(this.cells.get(adjCoords))
          }
        });
      });
    });
    return adjs;
  }

  getAdjascentCellCoords(coords){
    return this.getAdjascentCells(coords).map((cell) => {
      return cell.coords;
    });
  }

  incBombCount(fromCoords){
    let adjs = this.getAdjascentCells(fromCoords);
    if(adjs && adjs.forEach){
      adjs.forEach((cell) => {
        if(!cell.isBomb){
          cell.count++;
        }
      });
    }
    return;
  }
}
