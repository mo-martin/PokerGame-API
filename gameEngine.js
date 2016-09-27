var Game = require('./models/game');

dealCards = function(id, callback) {
	//uses game state to deal cards
	Game.findById(id, function(err, result) {
		if (err) console.log(err);
		switch(result.gameState) {
			case 1:
				//deal all players two cards
				dealToPlayers(result);
				//change the game state
				result.gameState = 2;
				break;
			case 2:
				//deal three cards the flop
				dealToBoard(result, 3);
				//change the game state
				result.gameState = 3;
				break;
			case 3:
				//deal the turn
				dealToBoard(result, 1);
				//change the game state
				result.gameState = 4;
				break;
			case 4:
				//deal the river
				dealToBoard(result, 1);
				break;
			default:
				//if db validation works this state is unreachable
				console.log("game state error");
		};
		//update database
		Game.findByIdAndUpdate(id, {$set : {
			players: result.players,
			boardPile: result.boardPile,
			gameState: result.gameState
		}},{
			new: true
		}, function(err, result) {
			//return deal data
			var data = {
				players: result.players,
				boardPile: result.boardPile
			};
			return callback(data);
		});
	});
}

dealToPlayers = function(game) {
	//for each player
	for (var i = 0; i < 5; i++) {
		//pop two cards from the deck and push them to the player hand
		game.players[i].hand.push(game.deck.pop());
		game.players[i].hand.push(game.deck.pop());
	}
}

dealToBoard = function(game, number) {
	//burn card
	game.burnPile.push(game.deck.pop());
	//add a number of cards to board pile
	for (var i = 0; i < number; i++) {
		game.boardPile.push(game.deck.pop());
	}
}

module.exports = {
	deal: dealCards
}