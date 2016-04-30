export default class Coords {
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toCellName(){
    return `cell-${this.x},${this.y},${this.z}`;
  }

  toStr(){
    return `${this.x},${this.y},${this.z}`;
  }

  isEqual(coords){
    return this.x == coords.x && this.y == coords.y && this.z == coords.z;
  }
}
