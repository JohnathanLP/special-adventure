let myGame = (function(){
  //Primary Variables:
  var lastTimeStamp;
  var speed = 25;
  var offset = 0;
  var background_offset = 0;

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
    delay: [1700,1700,1700]
  });
  girl.addAnimation({
    name: 'breathe',
    frames: 3,
    frameX: [0,1,2],
    frameY: [0,0,0],
    delay: [8500,2500,8500]
  });
  girl.setAnimation('run');

  let background = Graphics.Tile({
    imageSource: 'images/desert_background.png',
    position: {x:0, y:0},
    clip: {x:0, y:0, w:512, h:128}
  });

  let sandTiles = [];
  for(var i=0; i<9; i++){
    let sel = Math.floor(Math.random()*15);
    if(sel >= 4){
      sel = 0;
    }
    let sandTile = Graphics.Sprite({
      imageSource: 'images/sand_tiles.png',
      position: {x:32, y:97},
      clip: {x:32*sel, y:0, w:32, h:32}
    });
    sandTiles.push(sandTile);
  }

  let sandstorm = Graphics.ParticleSystem();

  //Secondary Functions:
  function drawSand(){
    for(var i=0; i<sandTiles.length; i++){
      sandTiles[i].drawAbs((i*32)-(offset%32),128);
    }
  }

  function snapSandTiles(){
    if(offset > 32){
      let sel = Math.floor(Math.random()*15);
      if(sel >= 4){
        sel = 0;
      }
      let sandTile = Graphics.Sprite({
        imageSource: 'images/sand_tiles.png',
        position: {x:32, y:97},
        clip: {x:32*sel, y:0, w:32, h:32}
      });
      sandTiles.push(sandTile);
      sandTiles.splice(0,1);
      offset = 0
    }
  }

  function drawBackground(){
    background.drawAbs(-background_offset/2,0);
    background.drawAbs((-background_offset+512)/2,0);
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

  function addSandstormParticles(){
    sandstorm.add({
      position: {x: 50, y: 50},
      direction: {x:1, y:1},
      speed: 5,
      rotation: 0,
      lifetime: 300
    });
  }

  function update(elapsedTime){
    var time = 0;
    if(!isNaN(elapsedTime)){
      time = elapsedTime;
    }
    girl.animate(time, speed);

    offset += speed/time;
    background_offset += speed/time;
    if(background_offset >= 512){
      background_offset = 0;
    }

    snapSandTiles();
    addSandstormParticles();
  }

  function render(){
    drawBackground();
    girl.drawCurr();
    drawSand();
    //sandstorm.draw();
  }

  return{
    initialize: initialize
  };
}());
