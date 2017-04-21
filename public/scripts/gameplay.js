myGame.screens['game-play'] = (function(game) {
  //Primary Variables:
  var lastTimeStamp;
  var speed = 30;
  var offset = 0;
  var background_offset = 0;
  var sandstorm_intensity = 1;
  var girlPosX = 32;
  var distance_run = 0;
  var cancelNextRequest = false;
  var girlVel = {x:0,y:0};
  var onGround = true;
  var terrH = 96;
  var crashFlag = false;
  var freeze = false;
  var day = 0;
  var dayTime = 0;
  var dayDur = 1000;
  var darkness = 0;
  var gameOver = false;

  //Tile and Sprite Creation
  let girl = Graphics.Sprite({
    imageSource: 'images/desert_girl.png',
    position: {x:32, y:96},
    clip: {x:0, y:0, w:32, h:32},
    hitbox: {x:19, y:2, w:15, h:30}
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
    delay: [2400,2200,2000, 900,900,900, 1700,3400,3400]
  });
  girl.setAnimation('run');

  let backgroundTop = Graphics.Background({
    imageSource: 'images/desert_background_top.png',
    position: {x:0, y:0},
    clip: {x:0, y:0, w:512, h:128}
  });
  let backgroundBot = Graphics.Background({
    imageSource: 'images/desert_background_bottom.png',
    position: {x:0, y:0},
    clip: {x:0, y:0, w:512, h:128}
  });

  let nightShader = Graphics.Shader({
      corner: { x: 0, y: 0 },
      size: { w: 256, h: 160 },
      r: 10,
      g: 0,
      b: 0,
      a: 0
  });

  //This stuff is still blurry, but not as bad
  let gameOverText = Graphics.Text({
    text : 'Game Over!',
    font : '16px Anton, Helvetica, sans-serif',
    fill : 'rgb(0, 0, 0)',
    stroke : 'rgb(0, 0, 0)',
    pos : {x : 80, y : 50}
  });

  let dayCompleteText = Graphics.Text({
    text : 'Day Complete',
    font : '16px Anton, Helvetica, sans-serif',
    fill : 'rgb(0, 0, 0)',
    stroke : 'rgb(0, 0, 0)',
    pos : {x : 80, y : 50}
  });

  //Text Rendering
  // let scoreText = Graphics.Text({
  //   text : 'Score: 0',
  //   font : '8px Anton, Helvetica, sans-serif',
  //   fill : 'rgb(0, 0, 0)',
  //   stroke : 'rgb(0, 0, 0)',
  //   pos : {x : 10, y : 10}
  // });
  //
  // let speedText = Graphics.Text({
  //   text : 'Speed: ',
  //   font : '8px Anton, Helvetica, sans-serif',
  //   fill : 'rgb(0, 0, 0)',
  //   stroke : 'rgb(0, 0, 0)',
  //   pos : {x : 200, y : 10}
  // });

  let sun = Graphics.Sprite({
    imageSource: 'images/sun.png',
    position: {x:32, y:32},
    clip: {x:0, y:0, w:20, h:20},
    hitbox: {x:0, y:0, w:20, h:20}
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
  //console.log(tiles);
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
        }
      }
    }
  }

  function pushTiles(){
    //TODO clean up/improve procedural generation
    if(offset > 32){
      distance_run++;
      //console.log(distance_run);
      speed += .1;
      if(speed > 30){
        speed = 30;
      }
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

  function testCrash(){
    let right = Math.floor((girl.getHitboxBounds().r-offset)/32);
    let safeFlag = true;
    for(var i=1; i<tiles.length; i++){
      if(tiles[i][right] != null){
        let girlHB = girl.getHitboxBounds();
        girlHB.b -= 5;
        if(rectangleCollision(girlHB, tiles[i][right].getHitboxBounds()) && !crashFlag){
          speed -= .8;
          //console.log(speed);
          safeFlag = false;
          crashFlag = true;
        }
      }
    }
    if(safeFlag){
      crashFlag = false;
    }
    //console.log(crashFlag);
  }

  function drawBackground(){
    backgroundTop.setPosition(-background_offset/2,0);
    backgroundTop.draw();
    backgroundTop.setPosition((-background_offset/2)+512,0);
    backgroundTop.draw();
    sun.draw();
    backgroundBot.setPosition(-background_offset/2,0);
    backgroundBot.draw();
    backgroundBot.setPosition((-background_offset/2)+512,0);
    backgroundBot.draw();
  }

  function addSandstormParticles(){
    for(var i=0; i<5; i++){
      sandstorm.add({
      position: {x: 256, y: (Math.random()*192)-64},
      direction: {x:-5, y:.5},
      speed: speed+(Math.random()*10)-5,
      rotation: 0,
      lifetime: 120/speed,
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
      let flag = false;
      if(bottom>=0 && bottom < tiles.length){
        for(var i=left; i<=right+1; i++){
          if(tiles[bottom][i] != null){
            if(rectangleCollision(girl.getHitboxBounds(),tiles[bottom][i].getHitboxBounds())){
              girl.setPosition(girlPosX,tiles[bottom][i].getHitboxBounds().t-32);
              girl.setAnimation('run');
              onGround = true;
              flag = true;
              girlVel.y = 0;
            }
          }
        }
      }
      if(!flag){
        onGround = false;
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

    var scoreField = document.getElementById('scoreSpan').innerHTML;
  	scoreField = "Score: " + distance_run;
  	document.getElementById('scoreSpan').innerHTML = scoreField;

    var speedField = document.getElementById('speedSpan').innerHTML;
  	text = "Speed: " + Number(speed).toFixed(2);
  	document.getElementById('speedSpan').innerHTML = text;

    //This is for the actual text rendering if we can find a way to make it not blurry
    //scoreText.setText('Score: ' + distance_run);
    //speedText.setText('Speed: ' + Number(speed).toFixed(2));

    testCrash();

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
    if(background_offset >= 1024){
      background_offset = 0;
    }

    pushTiles();
    sandstorm.update(time);
    addSandstormParticles();

    //game over
    if(speed <= 0){
      speed = 0;
      gameOver = true;
    }

    dayTime += time/100;
    sun.move(0,(65/dayDur)*(time/100));
    darkness += .0001;
    nightShader.setA(darkness);
  }

  function render(){
    drawBackground();
    drawTiles();
    girl.draw();
    sandstorm.draw();
    nightShader.draw();
    //Text Rendering
    //scoreText.draw();
    //speedText.draw();

    //This is rather hackery
    if(gameOver){
      gameOverText.draw();
      addScore(distance_run);
      cancelNextRequest = true;
    }
  }

  function run(){
    console.log('starting over?')
    Graphics.clearBackground();
    //cancelNextRequest = false;
    //distance_run = 0;
    //gameOver = false;
     speed = 30;
     offset = 0;
     background_offset = 0;
     sandstorm_intensity = 1;
     girlPosX = 32;
     distance_run = 0;
     cancelNextRequest = false;
     girlVel = {x:0,y:0};
     onGround = true;
     terrH = 96;
     crashFlag = false;
     freeze = false;
     day = 0;
     dayTime = 0;
     dayDur = 1000;
     darkness = 0;
     gameOver = false;
    //TODO Comment this back in. I just got tired of it playing.
    //AudioPlayer.playSound('audio/desert');

    myKeyboard = Input.Keyboard();
    var keyBoardControls = Persistence.getControls();
    //console.log(keyBoardControls);

    //TODO: Sun needs to reset
    //This isn't doing the trick
    sun.position = {x: 32, y: 32};
    //console.log(sun.position);

    if(isEmpty(keyBoardControls)){
      Persistence.add(74);
      myKeyboard.registerCommand(74, jump);
      var keyBoardControls = Persistence.getControls();
    }else{
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
