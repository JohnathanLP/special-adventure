myGame.screens['high-scores'] = (function(game) {
	'use strict';

	function initialize() {
		//myGame.persistence.report();
		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function() { game.showScreen('main-menu'); });
	}

	function run() {
		console.log('trying to get scores');
		showScores();
	}

	return {
		initialize : initialize,
		run : run
	};
}(myGame.game));
