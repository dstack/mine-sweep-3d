require('./styl/main.styl');

// orange = #E8920C
// green = #DFFF0D
// red = #ff0000
// purple = #600CE8
// blue = #33ccff


const TINY = {size: 3, mines: 19};
const BEGINNER = {size: 4, mines: 49}; // 49 mines in 64 squares
const INTERMEDIATE = {size: 5, mines: 65};
const MIDDLING = {size: 6, mines: 80};
const PRO = {size: 8, mines: 172};
const EXPERT = {size: 10, mines: 313};
const INSANE = {size: 16, mines: 1229};


import jvent from 'jvent';
import Game from './Game';

const EVT = new jvent();

window.EVT = EVT;

function hideAllCards(){
  var cards = document.querySelectorAll('.card');
  for(var i=0, cl = cards.length; i<cl; i++){
    var card = cards[i];
    card.classList.remove('visible');
  }
  return;
}

function showIntroCard(){
  hideAllCards()
  document.getElementById('intro-card').classList.add('visible');
}

function showLoseCard(){
  hideAllCards()
  document.getElementById('lose-card').classList.add('visible');
}

function showWinCard(){
  hideAllCards()
  document.getElementById('win-card').classList.add('visible');
}

function showSettingsCard(){
  hideAllCards()
  document.getElementById('settings-card').classList.add('visible');
}

function showTutorialCard(){
  hideAllCards()
  document.getElementById('tut-card').classList.add('visible');
}

function showAbout(){
  document.getElementById('about').classList.add('visible');
}

function hideAbout(){
  document.getElementById('about').classList.remove('visible');
}

function hideUICT(){
  document.getElementById('ui-ct').style.display = 'none';
}

function showUICT(){
  document.getElementById('ui-ct').style.display = 'block';
}

function toggleUICT(){
  var uict = document.getElementById('ui-ct');
  if(uict.style.display == 'none'){
    showUICT();
  }
  else{
    hideUICT();
  }
}

function handleGameEvents(game){
  game.EVT.on('game-over', (win) => {
    showUICT();
    setTimeout(() => {
      if(win){
        showWinCard();
      }
      else{
        showLoseCard();
      }
    }, 16);

  })
}

// initialize

showIntroCard();

let state = {
  currentGame: new Game(3, 0),
  setSize: 3,
  setBombs: 5
}
state.currentGame.EVT.emit('auto-rotate', true);

EVT.on('new-game', () => {
  state.currentGame.destroy();
  delete state.currentGame;
  state.currentGame = new Game(state.setSize, state.setBombs);
  handleGameEvents(state.currentGame);
  hideAllCards();
  setTimeout(hideUICT, 310);
});

EVT.on('setup-game', () => {
  showSettingsCard();
});

EVT.on('main-menu', () => {
  showIntroCard();
});

EVT.on('tutorial', () => {
  showTutorialCard();
});

EVT.on('about', () => {
  showAbout();
});

EVT.on('hide-about', () => {
  hideAbout();
});

EVT.on('set-size', (val) => {
  var size = Math.min(Math.max(val, 2), 32);
  state.setSize = size;
  document.getElementById('setting-cube-size').value = size;
});

EVT.on('set-count', (val) => {
  var size = document.getElementById('setting-cube-size').value;
  var mct = Math.min(val, Math.floor(size * 0.75));
  state.setBombs = mct;
  document.getElementById('setting-mine-count').value = size;
});

EVT.on('settings-from-preset', (val) => {
  if(val != 'custom'){
    var split = val.split('|'),
      size = parseInt(split[0], 10),
      mct = parseInt(split[1], 10);
    // update settings
    state.setSize = size;
    state.setBombs = mct;
    // update display
    document.getElementById('setting-cube-size').value = size;
    document.getElementById('setting-mine-count').value = mct;
  }
  console.log('preset', val);
});
