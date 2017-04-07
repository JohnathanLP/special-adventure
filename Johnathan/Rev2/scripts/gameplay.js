let myGame = (function(){
  //Primary Variables:
  var lastTimeStamp;
  var girlX = 32;

  //Tile Creation
  let girl = Graphics.Tile({
    imageSource: 'images/desert_girl.png',
    position: {x:32, y:97},
    clip: {x:0, y:0, w:32, h:32}
  });

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

  }

  function render(){
    girl.drawAbs(50,50);
  }

  return{
    initialize: initialize
  };
}());
