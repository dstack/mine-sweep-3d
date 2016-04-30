import Coords from './Coords';

export default class Cell {

  constructor(x,y,z,bomb){
    if(x instanceof Coords){
      // short form
      this.coords = x;
      this.isBomb = y;
    }
    else{
      // long form
      this.coords = new Coords(x,y,z);
      this.isBomb = bomb;
    }
    this.flipped = false;
    this.count = 0;
    this.marked = false
    this.tentativeMarked = false;
    return this;
  }

  get pos(){
    return this.coords;
  }
  get x(){
    return this.pos.x
  }
  get y(){
    return this.pos.y
  }
  get z(){
    return this.pos.z
  }
}
