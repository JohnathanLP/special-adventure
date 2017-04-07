let Graphics = (function(){
  let context = null;
  function initialize(){
    let canvas = document.getElementById('id-maincanvas');
    context = canvas.getContext('2d');

    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };
  }

  function beginRender(){
    context.clear();
  }

  //Does not have animations
  function Tile(spec){
    var that = {};
    var ready = false;
    var image = new Image();
    var animations = [];
    var currentAnimation;
    var counter = 0;
    var frame = 0;
    var animationSpeed = 1;

    image.onload = function(){
      ready = true;
    };
    image.src = spec.imageSource;

    that.drawAbs = function(xLoc, yLoc){
      if(ready){
        context.drawImage(
          image,
          spec.clip.x, spec.clip.y,
          spec.clip.w, spec.clip.h,
          xLoc, yLoc,
          spec.clip.w, spec.clip.h);
        context.restore();
      }
    }

    that.drawCurr = function(){
      if(ready){
        context.save();
        context.drawImage(
          image,
          spec.clip.x, spec.clip.y,
          spec.clip.w, spec.clip.h,
          spec.position.x,spec.position.y,
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

  //Has animations
  function Sprite(spec){
    var that = {};
    var ready = false;
    var image = new Image();
    var animations = [];
    var currentAnimation;
    var counter = 0;
    var frame = 0;
    var animationSpeed = 1;

    image.onload = function(){
      ready = true;
    };
    image.src = spec.imageSource;

    that.drawAbs = function(xLoc, yLoc){
      if(ready){
        context.drawImage(
          image,
          spec.clip.x, spec.clip.y,
          spec.clip.w, spec.clip.h,
          xLoc, yLoc,
          spec.clip.w, spec.clip.h);
        context.restore();
      }
    }

    that.drawCurr = function(){
      if(ready){
        context.save();
        context.drawImage(
          image,
          spec.clip.x, spec.clip.y,
          spec.clip.w, spec.clip.h,
          spec.position.x,spec.position.y,
          spec.clip.w, spec.clip.h);
        context.restore();
      }
    }

    that.setFrame = function(frame){
      spec.clip.x = frame.x*32;
      spec.clip.y = frame.y*32;
    }

    that.addAnimation = function(spec){
      //TODO - filter and check that animations are valid
      animations[spec.name] = spec;
      console.log('Animation Registered');
    }

    //IMPORTANT! You have to set an animation! If you don't set at least one, it'll crash
    that.setAnimation = function(spec){
      currentAnimation = spec;
      counter = 0;
    }

    that.animate = function(elapsedTime, speed){
      counter += (elapsedTime*animationSpeed);
      //console.log(counter);
      if(counter > animations[currentAnimation].delay[frame]/speed){
        counter = 0;
        frame++;
        if(frame >= animations[currentAnimation].frames){
          frame = 0;
        }
      }
      that.setFrame({x:animations[currentAnimation].frameX[frame], y:animations[currentAnimation].frameY[frame]});
    }

    that.setAnimationSpeed = function(spec){
      if(spec > 0 && spec <= 10){
        animationSpeed = spec;
      }
    }

    return that;
  }

  return{
    initialize: initialize,
    beginRender: beginRender,
    Tile: Tile,
    Sprite: Sprite
  };
}());
