myGame.screens['game-play'] = (function(game) {
  //Primary Variables:
  var lastTimeStamp;
  var speed = 20;
  var offset = 0;
  var background_offset = 0;
  var sandstorm_intensity = 1;
  var girlPosX = 32;
  var distance_run = 0;
  var cancelNextRequest = false;
  var girlVelY = 0;
  var onGround = true;
  var terrH = 96;

  //Tile and Sprite Creation
  let girl = Graphics.Sprite({
    imageSource: 'images/desert_girl.png',
    position: {x:32, y:96},
    clip: {x:0, y:0, w:32, h:32},
    hitbox: {x:2, y:2, w:27, h:32}
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
    frameX: [0,1,2, 0,1,2, 0,1,0],
    frameY: [2,2,2, 3,3,3, 4,4,2],
    delay: [2000,1800,1600, 700,700,700, 1000,3000,3000]
  });
  girl.setAnimation('run');

  let background = Graphics.Background({
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

  let obstacles = [];
  obstacles.push([]);
  //obstacles.push([]);
  for(var i=0; i<9; i++){
    obstacles[0].push(null);
    //obstacles[1].push(null);
  }

  let sandstorm = Graphics.ParticleSystem();

  //Secondary Functions:
  function drawSand(){
    for(var i=0; i<sandTiles.length; i++){
      sandTiles[i].setPosition((i*32)-(offset%32),128);
      sandTiles[i].draw();
    }
  }

  function snapSandTiles(){
    if(offset > 32){
      distance_run++;
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

  function drawObstacles(){
    for(var j=0; j<obstacles.length; j++){
      for(var i=0; i<obstacles[j].length; i++){
        if(obstacles[j][i] != null){
          obstacles[j][i].setPosition((i*32)-(offset%32),96-(32*j));
          obstacles[j][i].draw();
        }
      }
    }
  }

  function snapObstacles(){
    if(offset > 32){
      for(var i=0; i<obstacles.length; i++){
        let sel = Math.floor(Math.random()*5);
        let obstacle = Graphics.Sprite({
          imageSource: 'images/obstacles.png',
          position: {x:32, y:64},
          clip: {x:0, y:0, w:32, h:32}
        });
        if(sel == 0){
          obstacles[i].push(obstacle);
        }
        else {
          obstacles[i].push(null);
        }
        obstacles[i].splice(0,1);
      }
    }
  }

  function drawBackground(){
    background.setPosition(-background_offset/2,0);
    background.draw();
    background.setPosition((-background_offset+512)/2,0);
    background.draw();
  }

  function addSandstormParticles(){
    for(var i=0; i<5; i++){
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

  function processInput(elapsedTime) {
		myKeyboard.update(elapsedTime);
	}

  function handleGravity(){
    girl.move(0,girlVelY)
    girlVelY += .1;
    if(girl.getY() >= terrH){
      girlVelY = 0;
      girl.setPosition(girlPosX, terrH);
      onGround = true;
      girl.setAnimation('run');
    }
  }

  function jump(){
    if(onGround){
      girl.setAnimation('jump');
      onGround = false;
      girlVelY = -3;
    }
  }

  function getAltitude(){
    if(obstacles[0][2] != null){
      //console.log(64);
      return 64;
    }
    else{
      //console.log(96);
      return 96;
    }
  }

  //Primary Functions:
  function initialize(){

    document.getElementById('id-game-play-back').addEventListener(
		'click',
		function() {
			cancelNextRequest = true;
      game.showScreen('main-menu');
		});

    Graphics.initialize();
    AudioPlayer.initialize();

    //gameLoop();
  }

  function gameLoop(currTime){
    var elapsedTime = (currTime - lastTimeStamp);
    processInput(elapsedTime);

    update(elapsedTime);
    lastTimeStamp = currTime;
    render();

    if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
  }

  function update(elapsedTime){
    var time = 0;
    if(!isNaN(elapsedTime)){
      time = elapsedTime;
    }
    girl.animate(time, speed);

    if(girl.getY() < terrH){
      onGround = false;
    }
    if(!onGround){
      handleGravity();
    }

    terrH = getAltitude();
    offset += speed/time;
    background_offset += speed/time;
    if(background_offset >= 512){
      background_offset = 0;
    }

    snapObstacles();
    snapSandTiles();
    sandstorm.update(time);
    addSandstormParticles();
  }

  function render(){
    drawBackground();
    drawObstacles();
    girl.draw();
    drawSand();
    sandstorm.draw();
  }

  function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  function run(){
    cancelNextRequest = false;
    distance_run = 0;
    //TODO Comment this back in. I just got tired of it playing.
    //AudioPlayer.playSound('audio/desert');

    myKeyboard = Input.Keyboard();
    var keyBoardControls = Persistence.getControls();
    console.log(keyBoardControls);

    if(isEmpty(keyBoardControls)){
      Persistence.add(74);
      myKeyboard.registerCommand(74, jump);
      var keyBoardControls = Persistence.getControls();
      console.log(keyBoardControls);
    }else{
      console.log("we have something");
      var jumpKey = keyBoardControls.jump;
      myKeyboard.registerCommand(jumpKey, jump);
    }

		requestAnimationFrame(gameLoop);
  }

  return{
    initialize: initialize,
    run: run
  };
}(myGame.game));
