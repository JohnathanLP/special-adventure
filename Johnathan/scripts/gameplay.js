let myGame = (function(){
  //Primary Variables:
  var lastTimeStamp;
  var speed = 20;
  var offset = 0;
  var background_offset = 0;
  var sandstorm_intensity = 1;
  var girlPosX = 32;
  var distance_run = 0;

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

  let obstacles0 = [];
  let obstacles1 = [];
  let obstacles2 = [];
  for(var i=0; i<9; i++){
    obstacles0.push(null);
    obstacles1.push(null);
    obstacles2.push(null);
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
      distance_run++;
      offset = 0
    }
  }

  function drawObstacles(){
    for(var i=0; i<obstacles0.length; i++){
      if(obstacles0[i] != null){
        obstacles0[i].drawAbs((i*32)-(offset%32),96);
      }
      if(obstacles1[i] != null){
        obstacles1[i].drawAbs((i*32)-(offset%32),64);
      }
      if(obstacles2[i] != null){
        obstacles2[i].drawAbs((i*32)-(offset%32),32);
      }
    }
  }

  function snapObstacles(obstaclesRow){
    if(offset > 32){
      let sel = Math.floor(Math.random()*15);
      let obstacle = Graphics.Sprite({
        imageSource: 'images/obstacles.png',
        position: {x:32, y:64},
        clip: {x:0, y:0, w:32, h:32}
      });
      if(sel == 0){
        obstaclesRow.push(obstacle);
      }
      else {
        obstaclesRow.push(null);
      }
      obstaclesRow.splice(0,1);
    }
  }

  function addSupports(){
    if(obstacles1[obstacles1.length-1] != null){
      console.log('test');
      let obstacle = Graphics.Sprite({
        imageSource: 'images/obstacles.png',
        position: {x:32, y:64},
        clip: {x:32, y:0, w:32, h:32}
      });
      if(obstacles0[obstacles1.length-1] == null){
        obstacles0[obstacles1.length-1] = obstacle;
      }
    }
    if(obstacles2[obstacles2.length-1] != null){
      console.log('test2');
      let obstacle = Graphics.Sprite({
        imageSource: 'images/obstacles.png',
        position: {x:32, y:64},
        clip: {x:32, y:0, w:32, h:32}
      });
      if(obstacles0[obstacles1.length-1] == null){
        obstacles0[obstacles1.length-1] = obstacle;
      }
      if(obstacles1[obstacles1.length-1] == null){
        obstacles1[obstacles1.length-1] = obstacle;
      }
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
    distance_run = 0;
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
    background_offset += speed/time;
    if(background_offset >= 512){
      background_offset = 0;
    }

    //console.log(distance_run);

    snapObstacles(obstacles0);
    snapObstacles(obstacles1);
    snapObstacles(obstacles2);
    addSupports();
    snapSandTiles();
    sandstorm.update(time);
    addSandstormParticles();
  }

  function render(){
    drawBackground();
    drawObstacles();
    girl.drawCurr();
    drawSand();
    sandstorm.draw();
  }

  return{
    initialize: initialize
  };
}());
