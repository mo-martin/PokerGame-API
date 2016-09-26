var Game = require('../models/game');

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