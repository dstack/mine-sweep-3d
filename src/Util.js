export function uniqArray(arr){
  let cleanArr = [];
  arr.forEach((v) => {
    if(cleanArr.indexOf(v) === -1){
      cleanArr.push(v);
    }
  });
  return cleanArr;
}

const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function randString(len){
  len = len || 8;
  var str = '';
  for(var i=0; i<len; i++){
    str += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }
  return str;
}

export function range(bottom, top){
  var arr = [];
  for(var i=bottom; i<top; i++){
    arr.push(i);
  }
  return arr;
}
