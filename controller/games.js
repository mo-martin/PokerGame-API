var Game = require('../models/game');
var gameEngine = require('../gameEngine');

function newGame(req,res)
{
    var defaultState =
    {
        deck: createCards(),
        players: newPlayers()
    };
    Game.create(defaultState,function(err,result)
    {
        if(err) console.log(err);
        var data = {
            id: result._id,
            players: result.players
        }
        res.status(201).json(data);
    });
}

function newPlayers() {
    var players = [];
    var defaultPlayer;
    for (var i = 1; i <= 5; i++) {
        defaultPlayer = {
            id: i,
            hand: [],
            chips: 5000,
            bet: 0,
            hasFolded: false
        };
        players.push(defaultPlayer);
    }
    return players;
}

function deckDealCards(req, res) {
    gameEngine.deal(req.params.id, function(data) {
        res.status(200).json(data);
    });
}

function shuffleDeck(req,res) {
    //get the deck using the id
    Game.findById(req.params.id, function(err, result) {
        if (err) console.log(err);
        //shuffle the deck
        var newDeck = shuffle(result.deck);

        //update the game
        Game.findByIdAndUpdate(req.params.id,
            {$set: {deck: newDeck}},
            {new: true},
            function(err, game) {
                if(err) console.log(err);
                res.status(200).json(game);
        });
    });
}

function shuffle(arrayToShuffle)
{
//shuffles the deck
    var array = arrayToShuffle;

    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
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
                suit = "S" //Spades
            break;
            case 1:
                suit = "H" //Hearts
            break;
            case 2:
                suit = "C" //Clubs
            break;
            case 3:
                suit = "D" //Diamonds
            break;
            //default should be un-reachable
            default:
                suit = "Kermit the Frog iz d4 m4n"
            break;
        }
        //for each number and face cards
        for (var j = 1; j <=13; j++){
            var card = {
                Suit : suit,
                Value : j
            };
            newDeck.push(card);
        }
        //add to array

    }
    return newDeck;
}
function testCardValues(req,res)
{
    console.log(gameEngine.HandValue(req.body.Phand,req.body.Dhand));
}

function getCards(req, res) {
    Game.findById(req.params.id, function(err, result) {
        if (err) console.log(err);
        var data = {
            players: result.players,
            boardPile: result.boardPile
        }
        res.status(200).json(data);
    });
}

function resetDeck(req, res) {
    //run twice to reset all cards
    Game.findById(req.params.gameId, function(err, result) {
        if (err) console.log(err);
        for (var i = 0; i < result.burnPile.length; i++) {
            result.deck.push(result.burnPile.pop());
        }
        for (var i = 0; i < result.boardPile.length; i++) {
            result.deck.push(result.boardPile.pop());
        }
        for (var i = 0; i < result.players.length; i++) {
            result.deck.push(result.players[i].hand.pop());
            result.deck.push(result.players[i].hand.pop());
        }
        result.gameState = 1;
        result.save(function(err, saved) {
            if (err) console.log(err);
            res.status(200).json('deck reset');
        });
    });
}

module.exports =
{
    create : newGame,
    shuffle : shuffleDeck,
    deal : deckDealCards,
    testCard : testCardValues,
    getCards: getCards,
    reset: resetDeck
}