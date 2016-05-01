require('./controls/OrbitControls.js');
import {
  StandardCellMat,
  HoverCellMat,
  TentativeMarkedCellMat,
  MarkedCellMat,
  ShadowMat,
  countMats
} from './mats/StandardMats'
import Coords from './Coords';

const SHADOW_MAP_RES = 512;

const newCell = (function(){
  var geo = new THREE.BoxGeometry( 9, 9, 9 )
  var nc = new THREE.Mesh( geo, StandardCellMat );
  nc.castShadow = true;
  nc.receiveShadow = true;
  return nc;
})();

const FLOOR_Y = -25;

export default class GameInterface{
  constructor(emitter){
    this.renderTarget = document.getElementById('render-ct');
    this.currentCellCoords = false;
    this.currentIntersect = false;
    this.lastIntersect = false;
    this.lightPoint = false

    this.gameOver = false;

    this.cameraFOV = 75;

    this.getRWRH();

    this.EVT = emitter;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(this.cameraFOV, this.rw / this.rh, 0.1, 1000);
    this.camera.position.z = 150;
    this.camera.position.y = 10;

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(this.rw, this.rh);
    this.renderer.setClearColor(0xe8e8e8);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.soft = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;

    this.mouseTrack = {x: -2, y: -2}

    this.inDrag = false;
    this.inDragTimeout = false;
    this.renderer.domElement.addEventListener( 'mousemove', (evt) => {
      evt.preventDefault();
      if(!this.gameOver){
        this.mouseTrack.x = (evt.clientX / this.rw) * 2 - 1;
        this.mouseTrack.y = - (evt.clientY / this.rh) * 2 + 1;
      }
    }, false );

    this.renderer.domElement.addEventListener( 'click', (evt) => {
      evt.preventDefault();
      if(this.inDrag){
        return false;
      }
      if(this.currentCellCoords && !this.gameOver){
        this.EVT.emit('cell-click', this.currentCellCoords, false);
      }
    }, false );

    this.renderer.domElement.addEventListener('mousedown', (evt) => {
      this.inDragTimeout = setTimeout(() => {
        this.inDrag = true;
      }, 100);
    });
    this.renderer.domElement.addEventListener('mouseup', (evt) => {
      if(this.inDragTimeout){
        clearTimeout(this.inDragTimeout);
      }
      this.inDragTimeout = setTimeout(() => {this.inDrag = false;}, 16);
    });

    this.renderer.domElement.addEventListener( 'contextmenu', (evt) => {
      evt.preventDefault();
      if(this.currentCellCoords && !this.gameOver){
        this.EVT.emit('cell-click', this.currentCellCoords, true);
      }
      return false;
    }, false );



    window.addEventListener('resize', () => {
      this.getRWRH();
      this.camera.aspect = this.rw/this.rh;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.rw, this.rh);
    }, false);

    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.25;
		this.controls.enableZoom = false;
    this.controls.enablePan = false;

    this.raycaster = new THREE.Raycaster();

    this.renderTarget.appendChild(this.renderer.domElement);

    var floor = new THREE.Mesh(
      new THREE.PlaneGeometry(100000, 100000, 32, 32),
      ShadowMat
    );
    floor.rotation.x = Math.PI / -2;
    floor.position.y = FLOOR_Y;
    floor.receiveShadow = true;
    this.scene.add(floor);


    var ambLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    ambLight.position.y = 1000;
    this.scene.add(ambLight);

    this.topLight = this.mkSpotLight(0xffffff, 5);
    this.topLight.position.y = 200;
    this.scene.add(this.topLight);

    this.cursorLight = new THREE.PointLight(0xffffff, 1, 250);
    this.cursorLight.position.y = 200;
    this.scene.add(this.cursorLight);

    this.renderCells = new THREE.Object3D();
    this.cplanes = new THREE.Object3D();
    this.rcMap = new Map();
    this.scene.add(this.renderCells);
    this.scene.add(this.cplanes);

    this.EVT.on('auto-rotate', (on) => {
      this.controls.autoRotate = on;
    });

    this.EVT.on('cell-removed', (coords) => {
      var cell = this.rcMap.get(coords);
      this.renderCells.remove(cell);
    });

    this.EVT.on('cell-swap', (coords, count) => {
      var cell = this.rcMap.get(coords);
      if(cell){
        this.swapCellForCount(cell, count);
      }
    });

    this.EVT.on('cell-mark', (coords, count) => {
      var cell = this.rcMap.get(coords);
      if(cell){
        cell.material = cell.markMat;
      }
    });

    this.EVT.on('cell-tent-mark', (coords, count) => {
      var cell = this.rcMap.get(coords);
      if(cell){
        cell.material = cell.tentativeMarkMat;
      }
    });

    this.EVT.on('cell-unmark', (coords, count) => {
      var cell = this.rcMap.get(coords);
      if(cell){
        cell.material = cell.standardMat;
      }
    });

    this.EVT.on('game-over', (win) => {
      this.gameOver = true;
      // handle display for lose after that
    });

    this.animate();
  }

  destroy(){
    this.stopAnimate();
    for(var p in this){
      this[p] = null;
    }
    return;
  }

  swapCellForCount(cell, count){
    // we have the cell, convert to a world position
    var wpos = new THREE.Vector3();
    wpos.setFromMatrixPosition(cell.matrixWorld);
    var plane = this.mkCountPlane(count);
    plane.position.x = wpos.x;
    plane.position.y = wpos.y;
    plane.position.z = wpos.z;
    this.renderCells.remove(cell);
  }

  getRWRH(){
    // change here to measure actual container
    this.rw = this.renderTarget.innerWidth || window.innerWidth;
    this.rh = this.renderTarget.innerHeight || window.innerHeight;
    return;
  }

  mkCountPlane(count){
    var cplane = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 9, 8, 8),
      countMats['ct'+count]
    );
    this.cplanes.add(cplane);
    return cplane;
  }

  mkSpotLight(color, intesity){
    //SHADOW_MAP_RES
    var l = new THREE.SpotLight(color, intesity, 3000);
    l.castShadow = true;
    l.shadow.mapSize.width = SHADOW_MAP_RES;
    l.shadow.mapSize.height = SHADOW_MAP_RES;
    l.shadow.camera.near = 1;
    l.shadow.camera.far = 6000;
    l.shadow.camera.fov = this.cameraFOV;
    return l;
  }

  createEGHForCube(cube){
    cube.egh = new THREE.EdgesHelper(cube, 0x33ccff);
    cube.egh.material.visible = false;
    this.scene.add(cube.egh);
  }

  addCubeAt(coords){
    var cube = newCell.clone();
    cube.position.x = coords.x*10;
    cube.position.y = coords.y*10;
    cube.position.z = coords.z*10;
    cube.coords = coords;
    cube.material = StandardCellMat.clone();
    cube.standardMat = StandardCellMat.clone();
    cube.tentativeMarkMat = TentativeMarkedCellMat.clone();
    cube.markMat = MarkedCellMat.clone();
    this.createEGHForCube(cube);
    this.renderCells.add(cube);
    this.rcMap.set(coords, cube);
  }

  animate(){
    this.raf = requestAnimationFrame(() => {
      this.animate();
    });
    this.render();
  }

  stopAnimate(){
    cancelAnimationFrame(this.raf);
  }

  render(){

    this.controls.update();

    var fic = false,
      ci = false;
    this.raycaster.setFromCamera(this.mouseTrack, this.camera);
    var intersects = this.raycaster.intersectObjects(this.renderCells.children);

    if(intersects.length > 0 && !this.gameOver){
      var firstI = intersects[0];
      if(firstI.object && firstI.object.coords){
        fic = firstI.object.coords;
        ci = firstI.object;
      }
      var cameraPos = this.camera.position.clone();
      var offsetPoint = firstI.point.lerp(cameraPos, 50/firstI.distance);

      this.cursorLight.position.x = offsetPoint.x;
      this.cursorLight.position.y = offsetPoint.y;
      this.cursorLight.position.z = offsetPoint.z;
    }

    this.currentCellCoords = fic;
    this.currentIntersect = ci;
    // this controls the hover effect
    if(this.currentIntersect != this.lastIntersect){
      var rc = this.currentIntersect,
        li = this.lastIntersect;
      if(rc){
        rc.scale.x = 1.25;
        rc.scale.y = 1.25;
        rc.scale.z = 1.25;
        rc.material.emissiveIntensity = 0.5;
        rc.egh.material.visible = true;
      }
      if(li){
        li.scale.x = 1;
        li.scale.y = 1;
        li.scale.z = 1;
        li.material.emissiveIntensity = 0;
        li.egh.material.visible = false;
      }
    }
    this.lastIntersect = this.currentIntersect;

    this.cplanes.children.forEach((cplane) => {
      cplane.lookAt(this.camera.position);
    });

    this.renderer.render( this.scene, this.camera );
  }

  updateAll(){
    this.updateGroups();
    this.updateCameraPos();
    this.updateLights();
  }

  updateCameraPos(){
    var bbox = new THREE.Box3().setFromObject(this.renderCells);
    var delta = bbox.min.clone().lerp(bbox.max.clone(), 1.3),
      midY = (bbox.max.y - bbox.min.y) / 2;
    this.camera.lookAt(0, midY, 0);
    this.camera.position.x = delta.x
    this.camera.position.y = delta.y + 15
    this.camera.position.z = delta.z
  }

  updateGroups(){
    var bbox = new THREE.Box3().setFromObject(this.renderCells);
    var midX = (bbox.min.x + bbox.max.x) / 2,
      midZ = (bbox.min.z + bbox.max.z) /2;
    this.renderCells.position.x = midX * -1
    this.renderCells.position.z = midZ * -1;
  }

  updateLights(){
    var bbox = new THREE.Box3().setFromObject(this.renderCells);

    this.topLight.position.y = bbox.max.y + 200;
  }
}
