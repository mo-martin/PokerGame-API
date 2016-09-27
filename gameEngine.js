var Game = require('./models/game');

dealCards = function(id) {
	//uses game state to deal cards
	Game.findById(id, function(err, result) {
		if (err) console.log(err);
		console.log(result.deck[0]);
	});
}

module.exports = {
	deal: dealCards
}