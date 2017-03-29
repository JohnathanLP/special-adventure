let Graphics = (function(){
  let context = null;
  function initialize(){
    let canvas = document.getElementById('id-canvas');
    context = canvas.getContext('2d');

    CanvasRenderingContext2D.prototype.clear = function(){
      this.save();
      this.setTransform(1,0,0,1,0,0);
      this.clearRect(0,0, canvas.width, canvas.height);
      this.restore();
    };
  }

  function beginRender(){
    context.clear();
  }

  function Texture(spec){
    var that = {};
    var ready = false;
    var image = new Image();

    image.onload = function(){
      ready = true;
    };
    image.src = spec.imageSource;

    that.draw = function(){
      if(ready){
        context.save();
        context.drawImage(
          image,
          spec.clip.x, spec.clip.y,
          spec.clip.w, spec.clip.h,
          0,0,
          spec.clip.w, spec.clip.h);
        context.restore();
      }
    }

    that.setFrame = function(frame){
      spec.clip.x = frame.x*32;
      spec.clip.y = frame.y*32;
    }

    return that;
  }

  return{
    initialize: initialize,
    Texture: Texture,
    beginRender: beginRender
  }
}());

let sprite = Graphics.Texture({
  imageSource: 'images/desert_girl.png',
  clip: {x:0, y:0, w:32, h:32}
});

var timer = 0;
var lastTime = 0;

function animate(elapsedTime){
  if(!isNaN(elapsedTime)){
    timer += (elapsedTime - lastTime);
  }

  //console.log(timer);

  Graphics.beginRender();

  if(timer > 200){
    sprite.setFrame({x:0,y:0});
  }
  if(timer > 800){
    sprite.setFrame({x:1,y:0});
  }
  if(timer > 900){
    sprite.setFrame({x:2,y:0});
  }
  if(timer > 1000){
    sprite.setFrame({x:1,y:0});
    timer = 0;
  }

  sprite.draw();

  lastTime = performance.now();

  requestAnimationFrame(animate);
}

Graphics.initialize();
animate();
