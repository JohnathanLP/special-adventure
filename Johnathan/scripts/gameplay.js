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

  let girl = Graphics.Sprite({
    imageSource: 'images/desert_girl.png',
    position: {x:32, y:97},
    clip: {x:0, y:0, w:32, h:32}
  });

  let sandTile = Graphics.Tile({
    imageSource: 'images/sand_tiles.png',
    position: {x:32, y:97},
    clip: {x:0, y:0, w:32, h:32}
  });

  var background_offset = 0;
  var offset = 0;
  var speed = 1;

  function update(elapsedTime){
    girl.animate(elapsedTime);
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
    var sel = Math.random()*3;
    console.log(sel);
    for(var i=0; i<9; i++){
      sandTile.draw((32*i)-offset,128);
      // if(sel < 1){
      //   sandTile.setFrame({x:0,y:0});
      //   sandTile.draw((32*i)-offset,128);
      // }
      // else if(sel < 2){
      //   sandTile.setFrame({x:1,y:0});
      //   sandTile.draw((32*i)-offset,128);
      // }
      // else if(sel < 3){
      //   sandTile.setFrame({x:2,y:0});
      //   sandTile.draw((32*i)-offset,128);
      // }
    }
  }

  function drawBackground(){
    background.draw(background_offset,0);
    background.draw(background_offset-512,0);
  }

  function render(){
    drawBackground();
    sun.draw(32,32);
    //girl.draw();
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
