MyGame.screens['main-menu'] = (function(game) {
	'use strict';

	function initialize() {
		//
		// Setup each of menu events for the screens
		document.getElementById('id-new-game').addEventListener(
			'click',
			function() {game.showScreen('game-play'); });

		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() {
	      var text = document.getElementById('clearedScores').innerHTML;
	    	text = "";
	    	document.getElementById('clearedScores').innerHTML = text;

				Persistence.report();
				game.showScreen('high-scores'); });

		document.getElementById('id-credits').addEventListener(
			'click',
			function() { game.showScreen('credits'); });

	}

	function run() {
		//
		// I know this is empty, there isn't anything to do.
	}

	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game));
