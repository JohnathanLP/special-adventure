let myGame = (function(){
  //Primary Variables:
  var lastTimeStamp;
  var offset = 0;
  var speed = 15;
  var snap_flag = true;
  var snapped_flag = false;

  //Tile and Sprite Creation
  let girl = Graphics.Sprite({
    imageSource: 'images/desert_girl.png',
    position: {x:32, y:96},
    clip: {x:0, y:0, w:32, h:32}
  });
  girl.addAnimation({
    name: 'run',
    frames: 3,
    frameX: [0,1,2],
    frameY: [1,1,1],
    delay: [1600,1600,1600]
  });
  girl.addAnimation({
    name: 'breathe',
    frames: 3,
    frameX: [0,1,2],
    frameY: [0,0,0],
    delay: [300,300,300]
  });
  girl.setAnimation('run');

  let background = Graphics.Tile({
    imageSource: 'images/desert_background.png',
    position: {x:0, y:0},
    clip: {x:0, y:0, w:512, h:128}
  });

  let sandTiles = [];
  for(var i=0; i<9; i++){
    let sel = Math.floor(Math.random()*9);
    if(sel >= 3){
      sel = 0;
    }
    let sandTile = Graphics.Sprite({
      imageSource: 'images/sand_tiles.png',
      position: {x:32, y:97},
      clip: {x:32*sel, y:0, w:32, h:32}
    });
    sandTiles.push(sandTile);
  }

  let sand_tile = Graphics.Tile({
    imageSource: 'images/sand_tiles.png',
    position: {x:0, y:0},
    clip: {x:0, y:0, w:32, h:32}
  });

  //Secondary Functions:
  function drawSand(){
    for(var i=0; i<sandTiles.length; i++){
      sandTiles[i].drawAbs((i*32)-(offset%32),128);
    }
  }

  function snapSandTiles(){
    if(offset%32 > 18){
      snap_flag = true;
    }
    if(offset%32 < 18 && snap_flag){
      snapped_flag = false;
    }
    if(snap_flag && !snapped_flag){
      //console.log('snap');
      let sel = Math.floor(Math.random()*9);
      if(sel >= 3){
        sel = 0;
      }
      let sandTile = Graphics.Sprite({
        imageSource: 'images/sand_tiles.png',
        position: {x:32, y:97},
        clip: {x:32*sel, y:0, w:32, h:32}
      });
      sandTiles.push(sandTile);
      sandTiles.splice(0,1);
      snapped_flag = true;
      snap_flag = false;
    }
  }

  function drawBackground(){
    background.drawAbs(-offset/2,0);
    background.drawAbs((-offset+512)/2,0);
  }

  //Primary Functions:
  function initialize(){
    Graphics.initialize();
    gameLoop();
  }

  function gameLoop(currTime){
    var elapsedTime = (currTime - lastTimeStamp);

    update(elapsedTime);
    lastTimeStamp = currTime;
    render();
    requestAnimationFrame(gameLoop);
  }

  function update(elapsedTime){
    var time = 0;
    if(!isNaN(elapsedTime)){
      time = elapsedTime;
    }
    girl.animate(time, speed);

    offset += speed/time;

    if(offset >= 512){
      offset = 0;
    }
    snapSandTiles();
  }

  function render(){
    drawBackground();
    girl.drawCurr();
    drawSand();
  }

  return{
    initialize: initialize,
    girl: girl
  };
}());
