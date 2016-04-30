import ShadowMaterial from './ShadowMaterial';

// 0x600ce8

export const StandardCellMat = new THREE.MeshLambertMaterial({
  color: 0x33ccff,
  transparent: true,
  opacity: 0.75,
  emissive: 0xffffff,
  emissiveIntensity: 0
});

export const TentativeMarkedCellMat = new THREE.MeshLambertMaterial({
  color: 0x600ce8,
  transparent: true,
  opacity: 0.85,
  emissive: 0xffffff,
  emissiveIntensity: 0
});

export const MarkedCellMat = new THREE.MeshLambertMaterial({
  color: 0xff0000,
  transparent: true,
  opacity: 0.85,
  emissive: 0xffffff,
  emissiveIntensity: 0
});

export const ShadowMat = (function(){
  var shadMat = new ShadowMaterial();
  shadMat.opacity = 0.15;
  shadMat.depthWrite = false;
  return shadMat;
})();

export const countMats = (function(){
  var mats = {};
  for(var i=0; i <= 26; i++){
    var can = document.createElement('canvas'),
      con = can.getContext('2d');
    can.width = 256;
    can.height = 256;
    con.textAlign="center";
    con.font = "Bold 175px Arial";
    con.fillStyle = "rgba(255,0,0,0.95)";
    con.fillText(i+'', 128, 128);
    var tex = new THREE.Texture(can);
    tex.needsUpdate = true;
    var faceMat = new THREE.MeshBasicMaterial({color: 0xffffff, map: tex, transparent: true});
    mats['ct'+i] = faceMat;
  }
  return mats;
})();
