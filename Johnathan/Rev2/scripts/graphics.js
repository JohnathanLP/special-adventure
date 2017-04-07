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

  function Tile(spec){
    var that = {};
    var ready = false;
    var image = new Image();
    var animations = [];

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

    that.createAnimation = function(spec){
      var name = spec.name;
      var temp = []
      var frames = spec.frames;
      for(var iter=0; iter<frames; iter++){
        temp[iter] = {t: spec.iter.t, x:spec.iter.x, spec.iter.y};
      }
      animations[name] = temp;
    }

    return that;
  }

  return{
    initialize: initialize,
    beginRender: beginRender,
    Tile: Tile
  };
}());
