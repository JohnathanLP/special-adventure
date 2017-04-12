let myGame = (function(){
  //Primary Variables:
  var lastTimeStamp;
  var speed = 20;
  var offset = 0;
  var background_offset = 0;
  var sandstorm_intensity = 1;
  var girlVelY = 0;
  var jumpDelay = 0;
  var onGround = true;
  var girlPosX = 32;

  //Tile and Sprite Creation
  let girl = Graphics.Sprite({
    imageSource: 'images/desert_girl.png',
    position: {x:girlPosX, y:96},
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
  girl.addAnimation({
    name: 'jump',
    frames: 9,
    frameX: [0,1,2, 0,1,2, 0,1,2],
    frameY: [2,2,2, 3,3,3, 4,4,4],
    delay: [2000,2000,1700, 500,500,1700, 1700,1700,1700]
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

  function addSandstormParticles(){
    for(var i=0; i<sandstorm_intensity; i++){
      sandstorm.add({
      position: {x: 256, y: (Math.random()*192)-64},
      direction: {x:-5, y:.5},
      speed: speed,
      rotation: 0,
      lifetime: 4,
      width: 1,
      height: 1,
      fill: 'rgba(0, 0, 0, 1)',
      stroke: 'rgba(220, 200, 0, 1)'
      });
    }
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

    if(girl.getY() >= 96 && onGround == false){
      console.log('land');
      girl.setPosition(girlPosX, 96);
      onGround = true;
      girlVelY = 0;
      girl.setAnimation('run');
    }
    if(jumpDelay >= 1000){
      console.log('jump');
      onGround = false;
      girlVelY = -3;
      jumpDelay = 0;
      girl.setAnimation('jump');
    }

    if(onGround == true){
      jumpDelay += time;
    }
    else{
      girlVelY += .1;
    }

    console.log(girl.getY());

    girl.move(0, girlVelY);

    offset += speed/time;
    background_offset += speed/time;
    if(background_offset >= 512){
      background_offset = 0;
    }

    snapSandTiles();
    sandstorm.update(time);
    addSandstormParticles();
  }

  function render(){
    drawBackground();
    girl.drawCurr();
    drawSand();
    sandstorm.draw();
  }

  return{
    initialize: initialize
  };
}());
