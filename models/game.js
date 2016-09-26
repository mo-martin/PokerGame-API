var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema(
{
    deck : {type : Array , required : true},
    gameState : {type : Number, required : true},
    players : {type : Array , required : true},
    dealHand : {type : Array, required : true},
    pot : {type : Number, required : true},
    curBet : {type : Number, required : true}
});

module.exports = mongoose.model("Game",gameSchema);