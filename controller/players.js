var Game = require('../models/game');
var gameEngine = require('../gameEngine');

//function for when player folds
function fold(req, res) {
	//find game
	Game.findById(req.params.gameId, function(err, game) {
		//update player
		game.players[req.params.playerId].hasFolded = true;
		//update game in database
		game.save(function(err, savedGame) {
				if (err) console.log(err);
				res.status(200).json('player '+ req.params.playerId +' has folded');
		});
	});	
}

//player bet/raise/check/call
function bet(req, res) {
	//find game
	Game.findById(req.params.gameId, function(err, game) {
		//update player
		game.players[req.params.playerId].bet = req.params.bet;
		//update game in database
		game.save(function(err, savedGame) {
				if (err) console.log(err);
				res.status(200).json('player '+ req.params.playerId +' has placed a bet of ' + req.params.bet);
		});
	});	
}

module.exports = {
	fold: fold,
	bet: bet
}