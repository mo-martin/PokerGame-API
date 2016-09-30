var mongoose = require('mongoose');

var PlayerSchema = new mongoose.Schema({
	id: {type: Number},
	hand: {type: Array},
	chips: {type: Number, default: 5000},
	bet: {type: Number},
	hasFolded: {type: Boolean}
});

var GameSchema = new mongoose.Schema(
{
    deck: {type : Array, required : true},
    gameState: {type: Number, min: 1, max: 5, default: 1},
    players: [PlayerSchema],
    burnPile: {type: Array, default: []},
    boardPile: {type: Array, default: []},
    pot : {type : Number, required : true, default: 0},
    curBet : {type : Number, required : true, default: 0}
});

module.exports = mongoose.model("Game",GameSchema);