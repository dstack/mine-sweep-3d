import {randString} from './Util';
import Board from './Board';
import GameInterface from './GameInterface';

import jvent from 'jvent';

export default class Game {
  constructor(dims, bombCount){

    this.EVT = new jvent();

    this.reset();
    this.gameSeed = randString(32);

    this.EVT.on('cell-click', (coords, rightClick) => {
      if(!rightClick){
        this.handleFlip(coords);
      }
      else{
        this.handleMark(coords);
      }
    });

    this.board = new Board(dims, bombCount);
    this.interface = new GameInterface(this.EVT);

    this.board.init(this.gameSeed);

    // render the board
    this.board.cells.forEach((cell) => {
      this.interface.addCubeAt(cell.pos);
    });
    this.interface.updateAll();
  }

  checkVictory(){
    var vic = this.board.checkVictoryConditions();
    if(vic){
      this.win();
    }
  }

  emptyRender(){
    var renderCT = document.getElementById('render-ct');
    while(renderCT.firstChild){
      renderCT.removeChild(renderCT.firstChild);
    }
    return;
  }

  reset(){
    this.emptyRender();
  }

  destroy(){
    this.board.destroy();
    delete this.board;
    this.interface.destroy();
    delete this.interface;
    for(var p in this){
      this[p] = null;
    }
    return;
  }

  newGame(){

  }

  win(){
    this.EVT.emit('game-over', true);
  }

  lose(){
    this.EVT.emit('game-over', false);
  }

  handleMark(coords){
    var cell = this.board.cells.get(coords);
    if(cell.tentativeMarked){
      cell.tentativeMarked = false;
      cell.marked = true;
      this.EVT.emit('cell-mark', coords);
    }
    else if(cell.marked){
      cell.tentativeMarked = false;
      cell.marked = false;
      this.EVT.emit('cell-unmark', coords);
    }
    else{
      cell.tentativeMarked = true;
      cell.marked = false;
      this.EVT.emit('cell-tent-mark', coords);
    }
    this.checkVictory();
  }

  handleFlip(coordsArr){
    coordsArr = coordsArr instanceof Array? coordsArr : [coordsArr];
    // forEach go to the board, get this cell
    coordsArr.forEach((coords) => {
      var cell = this.board.cells.get(coords);
      if(!cell){
        return;
      }
      if(cell.isBomb){
        this.lose();
      }
      else if(cell.count === 0){
        // remove it from the board first
        this.board.cells.delete(coords);
        // update the display
        this.EVT.emit('cell-removed', coords);
        // send to adjascent cells
        setTimeout(() => {
          var adjs = this.board.getAdjascentCellCoords(coords);
          this.handleFlip(adjs);
        }, 25);
      }
      else{
        // remove it from the board first
        this.board.cells.delete(coords);
        // swap the cell for the number display
        this.EVT.emit('cell-swap', coords, cell.count);
      }
    });
    this.checkVictory();
  }
}
