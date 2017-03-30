MyGame.screens['credits'] = (function(game) {
	'use strict';

	function initialize() {
		document.getElementById('id-credits-back').addEventListener(
			'click',
			function() { game.showScreen('main-menu'); });
	}

	function run() {
	}

	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game));
