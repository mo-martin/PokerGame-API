var Game = require('./models/game');

dealCards = function(id, callback) {
	//uses game state to deal cards
	Game.findById(id, function(err, game) {
		if (err) console.log(err);
		switch(game.gameState) {
			case 1:
				//deal all players two cards
				dealToPlayers(game);
				//change the game state
				game.gameState = 2;
				break;
			case 2:
				//deal three cards the flop
				dealToBoard(game, 3);
				//change the game state
				game.gameState = 3;
				break;
			case 3:
				//deal the turn
				dealToBoard(game, 1);
				//change the game state
				game.gameState = 4;
				break;
			case 4:
				//deal the river
				dealToBoard(game, 1);
				//find winner
				//reset game
				break;
			default:
				//if db validation works this state is unreachable
				console.log("game state error");
		};
		//update database
		game.save(function(err, gameSaved) {
			if (err) console.log(err);
			//return deal data
			var data = {
				players: gameSaved.players,
				boardPile: gameSaved.boardPile
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

function takeBet(BetInfo)
{
    //bet info JSON with gameID / player id / bet amount
    Game.findById(BetInfo.id,function(err,result){
        if(err) console.log(err);
        //result == game object
        //assuming front end validation
        //maybe add checks with flash module
        result.player[BetInfo.pid].bet = BetInfo.bet;
        result.player[BetInfo.pid].cash -= BetInfo.bet;
        result.pot += BetInfo.bet;

    });
}

function payOut(winnerArray)
{
    //get an integer with which player won
    if(winnerArray.length == 1 )
        
    //special payout conditions

    //need to check for an all in bet
    
    //if all in bet is not as high as the others , then cap their payout
    var cappedWinners = []
}

module.exports = {
	deal: dealCards
}