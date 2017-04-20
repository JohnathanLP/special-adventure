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
  var girlVel = {x:0,y:0};
  var onGround = true;
  var terrH = 96;

  //Tile and Sprite Creation
  let girl = Graphics.Sprite({
    imageSource: 'images/desert_girl.png',
    position: {x:32, y:96},
    clip: {x:0, y:0, w:32, h:32},
    hitbox: {x:19, y:2, w:9, h:30}
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

  //tiles array, holds sand and tiles[1]
  let tiles = [];
  //add sand row
  tiles.push([]);
  for(var i=0; i<9; i++){
    let sel = Math.floor(Math.random()*15);
    if(sel >= 4){
      sel = 0;
    }
    let sandTile = Graphics.Tile({
      imageSource: 'images/sand_tiles.png',
      position: {x:32, y:97},
      clip: {x:32*sel, y:0, w:32, h:32}
    });
    tiles[0].push(sandTile);
  }
  console.log(tiles);
  //add first obstacle row
  tiles.push([]);
  for(var i=0; i<9; i++){
    tiles[1].push(null);
  }

  let sandstorm = Graphics.ParticleSystem();

  //Secondary Functions:
  function drawTiles(){
    for(var i=0; i<tiles.length; i++){
      for(var j=0; j<tiles[i].length; j++){
        if(tiles[i][j] != null){
          tiles[i][j].setPosition((j*32)-offset, 128-(32*i));
          tiles[i][j].draw();
        }else{
        }
      }
    }
  }

  function pushTiles(){
    //TODO clean up/improve procedural generation
    if(offset > 32){
      distance_run++;
      for(var i=0; i<tiles.length; i++){
        //sand tiles
        if(i == 0){
          let sel = Math.floor(Math.random()*15);
          if(sel >= 4){
            sel = 0;
          }
          let tile = Graphics.Tile({
            imageSource: 'images/sand_tiles.png',
            position: {x:32, y:97},
            clip: {x:32*sel, y:0, w:32, h:32}
          });
          tiles[i].push(tile);
        }
        //obstacle tiles
        else{
          let sel = Math.floor(Math.random()*5);
          if(sel == 1){
            let tile = Graphics.Tile({
              imageSource: 'images/obstacles.png',
              position: {x:32, y:64},
              clip: {x:0, y:0, w:32, h:32}
            });
            tiles[i].push(tile);
          }else{
            tiles[i].push(null);
          }
        }
        tiles[i].splice(0,1);
      }
      offset = 0;
    }
  }

  function rectangleCollision(a,b){
    if(a.l<b.r && a.r>b.l && a.t<b.b && a.b>b.t && a.t<b.b){
      return true;
    }
    else{
      return false;
    }
  }

  //TODO remove if unused
  function convertToGrid(spec){
    return{
      x: Math.floor((spec.x-offset)/32),
      y: Math.floor(spec.y/32)
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
    girlVel.y += .1;
    if(girlVel.y > 0){
      //iterate left to right all cells that intersect the bottom edge of the hitbox
      let left = Math.floor((girl.getHitboxBounds().l-offset)/32);
      let right = Math.floor((girl.getHitboxBounds().r-offset)/32);
      let bottom = 4-Math.floor(girl.getHitboxBounds().b/32);
      if(bottom>=0 && bottom < tiles.length){
        for(var i=left; i<=right+1; i++){
          if(tiles[bottom][i] != null){
            if(rectangleCollision(girl.getHitboxBounds(),tiles[bottom][i].getHitboxBounds())){
              girl.setPosition(girlPosX,tiles[bottom][i].getHitboxBounds().t-32);
              girl.setAnimation('run');
              onGround = true;
              girlVel.y = 0;
            }
          }
        }
      }
    }
    if(girlVel.y < 0){
      //TODO collide with tiles above
    }
    girl.move(girlVel.x,girlVel.y)
  }

  function jump(){
    if(onGround){
      girl.setAnimation('jump');
      onGround = false;
      girlVel.y = -3.5;
    }
  }

  function getAltitude(){
    if(tiles[1][2] != null){
      return 64;
    }
    else{
      return 96;
    }
  }

  function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
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

    let right = Math.floor((girl.getHitboxBounds().r-offset)/32);
    for(var i=1; i<tiles.length; i++){
      if(tiles[i][right] != null){
        if(girl.getHitboxBounds().r > tiles[i][right].getHitboxBounds().l && girl.getHitboxBounds().b > tiles[i][right].getHitboxBounds().t){
          //TODO clean up collision detection and decriment speed
          //console.log('crash');
        }
      }
    }

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

    pushTiles();
    sandstorm.update(time);
    addSandstormParticles();
  }

  function render(){
    drawBackground();
    girl.draw();
    drawTiles();
    sandstorm.draw();
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
