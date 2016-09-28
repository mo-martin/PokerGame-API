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
function getWinner(GameID)
{
    var handStrength = [];
    Game.findById(GameID,function(err,result){
        var baseHand = result.boardPile;
        for(var i = 0; i < result.players.length; ++i)
        {
            if(result.players[i].action == "fold")
                handStrength.push(0);
            else
                handStrength(getHandValue(result.players[i].hand,result.boardPile));
        }
    });
    // we need to find any side pots,
}
function getHandValue(PlayerHand, BoardHand,callback)
{
    var mergedhand = [];
    // mergedhand = PlayerHand;
    // mergedhand.concat(BoardHand);
    console.log(mergedhand);
    for(var c in BoardHand)
        mergedhand.push(BoardHand[c]);
    mergedhand.push(PlayerHand[0],PlayerHand[1]);
    console.log(mergedhand);
    var value = 0;
    
    // we keep separate instances of both hands for the special cases in checks
    if(testStraightFlush(PlayerHand, BoardHand) != 0 )
        return callback(testStraightFlush(PlayerHand, BoardHand));      
    value = test4ofKind(mergedhand.slice(0));
    if(value != 0 )
        return callback(value);
    value = testFullHouse(mergedhand.slice(0));
    if(value != 0 )
        return callback(value);
        console.log(mergedhand);    
    value = testFlush(PlayerHand, BoardHand);
    if(value != 0 )
        return callback(value);
        console.log(mergedhand.slice(0));           
    value = testStraight(mergedhand.slice(0));
    if(value != 0 )
        return callback(value);
        console.log(mergedhand.slice(0));    
    value = test3ofKind(mergedhand.slice(0));
    if(value != 0 )
        return callback(value);        
    value = test2Pair(mergedhand.slice(0));
    if(value != 0 )
        return callback(value);        
    value = testPair(mergedhand.slice(0));
    if(value != 0 )
        return callback(value);
    console.log("high card");
    return callback(1+testHighCard(mergedhand.slice(0))/100);
}
// complete
function testStraightFlush(PlayerHand, BoardHand)
{
    var hand = [];
    for(var c in BoardHand)
        hand.push(BoardHand[c]);
    hand.push(PlayerHand[0],PlayerHand[1]);
    var suitcounter = 0;
    // first we need to sort by suit
    hand.sort(function(a,b){return a.suit > b.suit ? -1 : 1; });
    // check if it is a flush
    for(var i = 0 ; i < hand.length-1; ++i)
    {
        if(hand[i].suit == hand[i+1].suit)
            suitcounter++;
        else
            suitcounter=0;
        if(suitcounter==4)
        {
            var correctsuit = hand[i].suit;
            for(var j = 0; j < hand.length; ++j)
            {
                if(hand[j].suit != correctsuit)
                {
                    hand.splice(j,1);
                    j--;
                }
                
            }
            // if it is a straight , its royal
            if(testStraight(hand) == 5.14)
                return 10;
            else if (testStraight(hand) != 0)
                return testStraight(hand)+4;
            else
                return 0;
        }
    }
    return 0;
}
// complete
function test4ofKind(hand)
{
    for(var i = 0; i < hand.length-3; ++i)
        for(var j = i+1; j < hand.length-2; ++j)
            for(var p = j+1; p < hand.length-1; ++p )
                for(var k = p+1; k < hand.length; ++k )
                    if(hand[i].value == hand[j].value && hand[j].value == hand[p].value && hand[p].value == hand[k].value)
                    {
                        var HC = getCardValue(hand[i])/100;
                        hand.splice(i,1);
                        hand.splice(j,1);
                        hand.splice(p,1);
                        hand.splice(k,1);
                        var k = testHighCard(hand)/10000;

                        return 8+HC+k;
                    }
    return 0;
}
// complete
function testFullHouse(hand)
{
    var scores = [];
    var threefound = false;
    hand.sort(function(a,b){return a.value>b.value  ? 1 : -1});
    for(var i = 0; i < hand.length-2; ++i)
        if(hand[i].value == hand[i+1].value && hand[i+1].value == hand[i+2].value)
        {
            
            threefound = true;
            var K = getCardValue(hand[i])/100;
            hand.splice(i,3);
            break;
        }
        
    if(!threefound)
        return 0;
    for(var i =0; i < hand.length-1; ++i)
        if(hand[i].value == hand[i+1].value)
        {            
            var T = getCardValue(hand[i])/10000;
            return 7+K+T;    
        }
    return 0;
}
// complete - need testing
function testFlush(PlayerHand, BoardHand)
{
    var hand = [];
    for(var c in BoardHand)
        hand.push(BoardHand[c]);
    hand.push(PlayerHand[0],PlayerHand[1]);
    var suitcounter = 0;
    // first we need to sort by suit
    hand.sort(function(a,b){return a.suit > b.suit ? -1 : 1; });
    // check if it is a flush
    for(var i = 0 ; i < hand.length-1; ++i)
    {
        if(hand[i].suit == hand[i+1].suit)
            suitcounter++;
        else
            suitcounter=0;
        if(suitcounter==4)
        {
            for(var j = 0 ; j < PlayerHand.length; ++j)
                if(hand[i].suit != PlayerHand[j].suit)
                {

                    PlayerHand.splice(j,1);
                    j--;
                }
            return 6 + testHighCard(BoardHand)/100 + testHighCard(PlayerHand)/10000; 
        }
    }
    return 0;
}
// complete
function testStraight(hand)
{
    hand.sort(function(a,b){return getCardValue(a)>getCardValue(b)  ? -1 : 1});
    var straightCounter = 0;
    for(var i = 0 ; i < hand.length-1; ++i)
    {
        if(hand[i].value == (hand[i+1].value+1))
            straightCounter++;
        else
            straightCounter=0;
        console.log(straightCounter);
        if(straightCounter == 4)
        {
            var HC = getCardValue(hand[i-3])/100;
            return 5 + HC;
        }
    }
    return 0;
}
// complete
function test3ofKind(hand)
{
    console.log("3ofKind");
    hand.sort(function(a,b){return getCardValue(a)>getCardValue(b)  ? -1 : 1});
    console.log(hand);
     for(var i = 0; i < hand.length-2; ++i)
     {
        if(hand[i].value == hand[i+1].value && hand[i+1].value == hand[i+2].value)
        {
            var HC = getCardValue(hand[i])/100;
            hand.splice(i,3);
            return 4+HC+getHandValue(hand)/10000;    
        }
     }
    console.log("3ofKindFaild");
    return 0;
}
// complete
function test2Pair(hand)
{
    var HC = 0;
    var pairincre = 0;
    for(var i = 0; i < hand.length-1; ++i)
        for(var j = i+1; j < hand.length; ++j)
            if(hand[i].value == hand[j].value)
               {
                   pairincre++;
                   if(testHighCard([hand[i],hand[i+1]])/100 > HC)
                        HC = testHighCard([hand[i],hand[i+1]])/100;
                   if(pairincre == 2)
                        return 3+HC;
               }
    return 0;
}
// complete
function testPair(hand)
{
    for(var i = 0; i < hand.length-1; ++i)
        for(var j = i+1; j < hand.length; ++j)
            if(hand[i].value == hand[j].value)
                return 2 + getCardValue(hand[i])/100;
    return 0;
}
// complete
function getCardValue(card)
{
    if(card.value == 1)
        return 14;
    return card.value;
}
// complete
function testHighCard(hand)
{
    var highvalue = 0;
    for(var i =0 ; i < hand.length; i++)
        if(getCardValue(hand[i]) > highvalue )
            highvalue = (getCardValue(hand[i]));
    console.log(highvalue);
    return highvalue;
}

function payOut(winnerData)
{
    //get an integer with which player won
    if(winnerData.winners.length == 1 )
    {
        // only one winner
        Game.findById(winnerData.gameID, function(err,result){
            result.players[winnerData.winners[0]].cash += result.pot;
            endRound(winnerData.gameID);
        });
    }
    else
    {
         //special payout conditions
         //need to check for an all in bet / we check that in the get winner function
         //if all in bet is not as high as the others , then cap their payout
         Game.findById(winnerData.gameID,function(err,result){
             for(var i = 0; i < winnerData.winners.length;++i)
             {
                 result.players[winnerData.winners[0]].bet
             }
         });
    }
}
function endRound(gameID)
{
    // STUB !!!!!!!!!!!
        console.log("STUB code hit gameEngine.js endRound function");
    // Game.findById(winnerData.gameID, function(err,result){
        
    // });
}

module.exports = {
	deal: dealCards,
    HandValue : getHandValue
}
