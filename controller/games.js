var Game = require('../models/game');


function newGame(req,res)
{
    console.log("starting new game");
    var defaultState = 
    {
        Deck: createCards()
    }
    Game.Create(defaultState,function(err,result)
    {
        if(err) console.log(err);
        res.status(201).json(result);
        
    });

}

function createCards()
{
    var newDeck = [];
    //for each suit
    for (var i = 0; i < 4; i++) {
        var suit = "";
        //set suit
        switch(i){
            case 0:
                suit = "Spades"
            break;
            case 1:
                suit = "Hearts"
            break;
            case 2:
                suit = "Clubs"
            break;
            case 3:
                suit = "Diamonds"
            break;
            //default should be un-reachable
            default:
                suit = "HOW?!"
            break;
        }
        //for each number and face cards
        for (var j = 1; j <=13; j++){
            var card = {
                        Suit : suit,
                        Value : j  };
        }
        //add to array
        newDeck.push(card);
    }
    return newDeck;
}

module.exports = 
{
    new : newGame
}