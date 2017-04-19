let Persistence = (function (){
		'use strict';

		//this is only going to take event.keyCode (value)
		function add(value) {

			//Backspace key
			if(value != 8){
				localStorage.clear();
				var controls = {},
					previousControls = localStorage.getItem('myGame.controls');
				if (previousControls !== null) {
					controls = JSON.parse(previousControls);
				}
				controls['jump'] = value;
				localStorage['myGame.controls'] = JSON.stringify(controls);
			}
			//THESE ARE FOR TESTING
			var keyBoardControls = Persistence.getControls();
	    console.log(keyBoardControls);
		}

		function getControls() {
      var controls = {},
  			previousControls = localStorage.getItem('myGame.controls');
  		if (previousControls !== null) {
  			controls = JSON.parse(previousControls);
  		}
			return controls;
		}

		return {
			add : add,
			getControls : getControls
		};
	}());
