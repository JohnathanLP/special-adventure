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

  var background_offset = 0;
  var offset = 0;
  var speed = 15;

  var particles = [];
  var lastTimeStamp = performance.now();

  function update(elapsedTime){
    girl.animate(elapsedTime, speed);
    console.log(elapsedTime);
    //background_offset -= speed;

    if(!isNaN(elapsedTime)){
      background_offset -= (speed)/elapsedTime;
    }
    if(background_offset < 0){
      background_offset = 512;
    }
    if(!isNaN(elapsedTime)){
      offset += (speed*2)/elapsedTime;
    }
    //console.log(offset);
    if(offset >= 32){
      offset = 0;
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
    }

    //!!! BEGIN PARTICLES: MUST BE MOVED TO GRAPHICS !!!
    var particle = 0,
			aliveParticles = [],
			p;

		//
		// Go through and update each of the currently alive particles
		aliveParticles.length = 0;
		for (particle = 0; particle < particles.length; particle++) {
			//
			// A return value of true indicates this particle is still alive
			if (particles[particle].update(elapsedTime)) {
				aliveParticles.push(particles[particle]);
			}
		}
		particles = aliveParticles;

		//
		// Generate some new particles
    for (particle = 0; particle < 5; particle++) {
			p = {
				position: {x: 260, y: Random.nextGaussian(30,80)},
				direction: {x:-.5, y:.05},
				speed: Random.nextGaussian(400, 15),		// pixels per second
				rotation: 0,
				lifetime: Random.nextGaussian(2, 1)		// seconds
			};

			particles.push(Graphics.Particle(p));
		}
    //!!! END PARTICLES !!!
  }

  function drawSand(){
    for(var i=0; i<9; i++){
      //sandTile.draw((32*i)-offset,128);
      sandTiles[i].drawTile((32*i)-offset,128);
    }
  }

  function drawBackground(){
    background.draw(background_offset,0);
    background.draw(background_offset-512,0);
  }

  function render(){
    drawBackground();
    sun.draw(32,32);
    girl.draw();


    //!!! BEGIN PARTICLES - MUST BE MOVED TO GRAPHICS !!!
    var particle;

		for (particle = 0; particle < particles.length; particle++) {
			particles[particle].draw();
		}
    //!!! END PARTICLES !!!

    drawSand();
  }

  function gameLoop(time){
    var elapsedTime = (time - lastTimeStamp);

    update(elapsedTime);
    lastTimeStamp = time;

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
