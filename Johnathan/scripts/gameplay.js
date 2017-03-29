let myGame = (function(){
  let background = Graphics.Texture({
    imageSource: 'images/desert_background.png',
    center: {x:0, y:0},
    clip: {x:0, y:0, w:512, h:128},
    width: 512,
    height: 128,
    rotation: 0
  });

  let sun = Graphics.Texture({
    imageSource: 'images/sun.png',
    center: {x:0, y:0},
    clip: {x:0, y:0, w:19, h:19},
    width: 20,
    height: 20,
    rotation: 0
  });

  let sandTile = Graphics.Texture({
    imageSource: 'images/sand.png',
    center: {x:0, y:0},
    clip: {x:0, y:0, w:32, h:32},
    width: 32,
    height: 32,
    rotation: 0
  });

  var background_offset = 0;
  var offset = 0;
  var speed = 1;

  function update(elapsedTime){
    background_offset -= speed;
    if(background_offset < 0){
      background_offset = 512;
    }
    offset += speed*2;
    if(offset >= 32){
      offset = 0;
    }
  }

  function drawSand(){
    for(var i=0; i<9; i++){
      sandTile.draw((32*i)-offset,128);
    }
  }

  function drawBackground(){
    background.draw(background_offset,0);
    background.draw(background_offset-512,0);
  }

  function render(){
    drawBackground();
    sun.draw(32,32);
    drawSand();
  }

  function gameLoop(elapsedTime){
    update(elapsedTime);
    render();
    requestAnimationFrame(gameLoop);
  }

  function initialize(){
    Graphics.initialize();
    gameLoop();
  }

  return{
    initialize: initialize
  };
}());
