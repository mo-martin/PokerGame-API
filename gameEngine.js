var Game = require('./models/game');

function dealCards(id, callback) {
	//uses game state to deal cards
	Game.findById(id, function(err, game) {
        var data;
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
                game.gameState = 5;
				//find winner
				//reset game
				break;
            case 5:
                console.log("hit case 5");
                getWinner(game,function(res){data = res;});
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

function dealToPlayers(game) {
	//for each player
	for (var i = 0; i < 5; i++) {
		//pop two cards from the deck and push them to the player hand
		game.players[i].hand.push(game.deck.pop());
		game.players[i].hand.push(game.deck.pop());
	}
}

function dealToBoard(game, number) {
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
function payWinner(GameID,PlayerID,Amount)
{
    console.log(PlayerID);
    Game.findById(GameID, function(err,result){
        if(err) console.log(err);
        result.players[PlayerID].chips += Amount;
        result.save();
        console.log("Player "+PlayerID.toString()+"Paid "+Amount);
    });

}
function getWinner(game,callback)
{
    var handStrength = [];
    var winningData = [];
    var SidePotAllocated = 0;
    var SidePotPaid = 0;
    var returnData = [];
    //load winning data
    console.log("Start Get Hand Values Function");
    for(var i = 0; i < game.players.length; ++i)
        if(!game.players[i].hasFolded)
        {
            winningData.push({PlayerID : i ,handStrength : getHandValue(game.players[i].hand , game.boardPile)});
        };
    console.log("End Get Hand Values")


    // console.log("winning data =  " +winningData[0].handStrength);
    //now we sort based on hand strength
    winningData.sort(function(a,b){return a.handStrength > b.handStrength ? -1 : 1});
    console.log("winning data =  ") 
    console.log(winningData);
    console.log("Start Paying Out Monies");

    console.log(game.players[winningData[0].PlayerID].bet );
    var totalSidePotAllocated = 0;
    while(game.players[winningData[0].PlayerID].bet < game.curBet)
    {
        console.log("Start Side Pot Calcs");
        //this main winner is part of a side pot we need to remove them and do it again
        // we need to work out how much of the pot they are eligble for
        // they get their bet times remaining players
        var potWon = winningData.length * (game.players[winningData[0].PlayerID].bet - SidePotAllocated);
        console.log(game.players[winningData[0].PlayerID].bet );
        console.log("Pot Won :");
        console.log(potWon);
        returnData.push({
            Player: winningData[0].PlayerID,
            WinAmount: potWon});
        
        payWinner(game.id,game.players[winningData[0].PlayerID].id,potWon);
        SidePotAllocated = game.players[winningData[0].PlayerID].bet;
        totalSidePotAllocated +=potWon;
        winningData.shift();
        console.log("End Side Pot Calcs");
    }
    console.log("Start Main Pot Calcs");
    // now we payout to the winner
    console.log(game.pot);
    game.pot-=totalSidePotAllocated;
    payWinner(game.id,game.players[winningData[0].PlayerID].id,game.pot);
    returnData.push({
        Player: winningData[0].PlayerID,
        WinAmount: game.pot});
    console.log(returnData);
    console.log("FINISHED !!!!!!!!!!");
    callback (returnData);
} 
function getHandValue(PlayerHand, BoardHand)
{
    var mergedhand = [];
    // mergedhand = PlayerHand;
    // mergedhand.concat(BoardHand);
    for(var i = 0 ; i < BoardHand.length; ++i)
        mergedhand.push(BoardHand[i]);
    mergedhand.push(PlayerHand[0],PlayerHand[1]);
     console.log("Merged Hand : ")
     console.log(mergedhand);
    var value = 0;
    // we keep separate instances of both hands for the special cases in checks
    console.log("StraightFlush test")
    if(testStraightFlush(PlayerHand, BoardHand) != 0 )
        return (testStraightFlush(PlayerHand, BoardHand))
    console.log("test4ofKind test")    
    value = test4ofKind(mergedhand);
    if(value != 0 )
        return (value);
    console.log("testFullHouse test")
    value = testFullHouse(mergedhand);
    if(value != 0 )
        return (value);
    console.log("testFlush test")
    value = testFlush(PlayerHand, BoardHand);
    if(value != 0 )
        return (value);
    console.log("testStraight test")
    value = testStraight(mergedhand);
    if(value != 0 )
        return (value);
    console.log("test3ofKind test")
    value = test3ofKind(mergedhand);
    if(value != 0 )
        return (value);        
    console.log("test2Pair test")
    value = test2Pair(mergedhand);
    if(value != 0 )
        return (value);        
    console.log("testPair test")
    value = testPair(mergedhand);
    if(value != 0 )
        return (value);
    return (1+testHighCard(mergedhand)/100);
}
// complete
function testStraightFlush(PlayerHand, BoardHand)
{
    var hand = [];
    var returnVal = 0;
    for(var i = 0 ; i < BoardHand.length; ++i)
        hand.push(BoardHand[i]);
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
            //console.log(hand);
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
            {
                console.log("royalFlushHit");
                returnVal = 10;
            }
            else if (testStraight(hand) != 0)
            {
                console.log("StraightFlushHit");
                returnVal =  testStraight(hand)+4;
            }
            else
                returnVal =  0;
        }
    }
    return returnVal;
}
// complete
function test4ofKind(hand)
{
    var returnVal = 0;
    hand.sort(function(a,b){return a.value > b.value ? 1 : -1});
    for(var i = 0; i < hand.length-3; ++i)
        if(hand[i].value === hand[i+1].value && hand[i+1].value === hand[i+2].value && hand[i+2].value === hand[i+3].value) {
            var HC = getCardValue(hand[i])/100;
            hand.splice(i,4);
            var k = testHighCard(hand)/10000;
            returnVal =  8+HC+k;
            console.log("4ofKindHit");
        }
    return returnVal;
}
// complete
function testFullHouse(hand)
{
    var scores = [];
    var returnVal = 0;
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
        
    if(threefound)
    {
        for(var i =0; i < hand.length-1; ++i)
            if(hand[i].value == hand[i+1].value)
            {            
                var T = getCardValue(hand[i])/10000;
                returnVal =  7+K+T; 
                console.log("fullhouseHit");   
            }
    }
    return returnVal;
}
// complete - need testing
function testFlush(PlayerHand, BoardHand)
{
    var hand = [];
    var returnVal = 0;
    for(var i = 0 ; i < BoardHand.length; ++i)
        hand.push(BoardHand[i]);
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
                console.log("flushHit");
            returnVal =  6 + testHighCard(BoardHand)/100 + testHighCard(PlayerHand)/10000; 
        }
    }
    return returnVal;
}
// complete
function testStraight(hand)
{
    var returnVal = 0;
    hand.sort(function(a,b){return getCardValue(a)>getCardValue(b)  ? -1 : 1});
    var straightCounter = 0;
    for(var i = 0 ; i < hand.length-1; ++i)
    {
        if(hand[i].value == (hand[i+1].value+1))
            straightCounter++;
        else
            straightCounter=0;
        if(straightCounter == 4)
        {
            var HC = getCardValue(hand[i-3])/100;
            returnVal =  5 + HC;
            console.log("StraightHit");
        }
    }
    return returnVal;
}
// complete
function test3ofKind(hand)
{
    var returnVal = 0;
    hand.sort(function(a,b){return getCardValue(a)>getCardValue(b)  ? -1 : 1});
     for(var i = 0; i < hand.length-2; ++i)
     {
        if(hand[i].value == hand[i+1].value && hand[i+1].value == hand[i+2].value)
        {
            var HC = getCardValue(hand[i])/100;
            hand.splice(i,3);
            console.log("3ofKindHit");
            returnVal =  4+HC+getHandValue(hand)/10000;    
        }
     }
    return returnVal;
}
// complete
function test2Pair(hand)
{
    var HC = 0;
    var K = 0;
    var returnVal = 0;
    var pairincre = 0;
    hand.sort(function(a,b){return getCardValue(a)>getCardValue(b)  ? -1 : 1});
    for(var i = 0; i < hand.length-1; ++i)
        if(hand[i].value == hand[i+1].value)
            {
                console.log("pre2pairhit");
                pairincre++;
                if(testHighCard([hand[i],hand[i+1]])/100 > HC)
                {
                    if(HC!= 0 )
                    {
                        K=HC/100;
                    }
                    HC = testHighCard([hand[i],hand[i+1]])/100;
                }
                else
                    K = testHighCard([hand[i],hand[i+1]])/10000;
                    
                if(pairincre == 2)
                {
                    console.log("2pairhit");
                    console.log(HC);
                    console.log(K);
                    returnVal =  3+HC+K;
                }
            }
    return returnVal;
}
// complete
function testPair(hand)
{
    var returnVal = 0;
    var HC,K = 0;
    hand.sort(function(a,b){return getCardValue(a)>getCardValue(b)  ? -1 : 1});
    for(var i = 0; i < hand.length-1; ++i)
        if(hand[i].value == hand[i+1].value)
        {
            console.log("pairhit");
            HC = getCardValue(hand[i])/100;
            hand.splice(i,2);
            K = testHighCard(hand)/10000;
            console.log(HC);
            console.log(K);
            returnVal =  2 + HC+K;
        }
    return returnVal;
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
    return highvalue;
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
