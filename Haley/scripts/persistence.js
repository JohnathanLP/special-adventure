let Persistence = (function (){
		'use strict';

		//this is only going to take event.keyCode (value)
		function add(value) {
			localStorage.clear();
      var controls = {},
  			previousControls = localStorage.getItem('myGame.controls');
  		if (previousControls !== null) {
  			controls = JSON.parse(previousControls);
  		}

			controls['jump'] = value;
			localStorage['myGame.controls'] = JSON.stringify(controls);

			console.log("Added new control");
			var keyBoardControls = Persistence.getControls();
	    console.log(keyBoardControls.jump);
		}

		//THIS STILL NEEDS TO GET REWRITTEN. Need some way to return the controls
		function getControls() {
      var controls = {},
  			previousControls = localStorage.getItem('myGame.controls');
  		if (previousControls !== null) {
  			controls = JSON.parse(previousControls);
  		}
			//eh?
			return controls;
		}

		return {
			add : add,
			getControls : getControls
		};
	}());
