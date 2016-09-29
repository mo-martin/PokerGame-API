var Game = require('../models/game');
var gameEngine = require('../gameEngine');

//function for when player folds
function fold(req, res) {
	//find game
	Game.findById(req.params.gameId, function(err, game) {
		var id = req.params.playerId - 1;
		//update player
		game.players[id].hasFolded = true;
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
		game.players[req.params.playerId-1].bet = req.params.bet;
		//update game in database
		game.save(function(err, savedGame) {
				if (err) console.log(err);
				res.status(200).json('player '+ req.params.playerId +' has placed a bet of ' + req.params.bet);
		});
	});	
}

//ai move
function aiMove(req, res) {
	//find the game
	Game.findById(req.params.gameId, function(err, game) {
		//pick a random move
		var rand = Math.floor(Math.random()*100);
		if (rand < 10) {
			//raise/bet
			res.status(200).json('player '+ req.params.playerId +' has raised');
		} else if (rand < 70) {
			//call/check
			res.status(200).json('player '+ req.params.playerId +' has called');
		} else {
			//fold
			res.status(200).json('player '+ req.params.playerId +' has folded');
		}
	});
}

module.exports = {
	fold: fold,
	bet: bet,
	aiMove: aiMove
}