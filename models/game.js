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
    gameState: {type: Number, min: 1, max: 4, default: 1},
    players: [PlayerSchema],
    burnPile: {type: Array, default: []},
    boardPile: {type: Array, default: []},
    pot : {type : Number, required : true, default: 0},
    curBet : {type : Number, required : true, default: 0},
    updatedAt: {type: Date},
    expiresAt: {type: Date}
});

//GameSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

GameSchema.pre("save", function(next) { 
    this.updatedAt = new Date();
    next(); 
});

module.exports = mongoose.model("Game",GameSchema);