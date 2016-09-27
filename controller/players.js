var Game = require('../models/game');
var gameEngine = require('../gameEngine');

//function for when player folds
function fold(req, res) {
	//find game
	Game.findById(req.params.gameId, function(err, result) {
		//update player
		result.players[req.params.playerId].hasFolded = true;
		//update database
		Game.findByIdAndUpdate(req.params.gameId,
			{$set:result},
			{new: true},
			function(err, updated) {
				if (err) console.log(err);
				res.status(200).json('player has folded');
		});
	});	
}

module.exports = {
	fold: fold
}