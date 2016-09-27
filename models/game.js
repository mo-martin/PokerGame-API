var mongoose = require('mongoose');

var PlayerSchema = new mongoose.Schema({
	hand: {type : Array},
	chips: {type : Number},
	bet: {type : Number},
	hasFolded: {type : Boolean}
});

var GameSchema = new mongoose.Schema(
{
    deck : {type : Array , required : true},
    gameState: {type: Number},
    players: [PlayerSchema]
});

module.exports = mongoose.model("Game",GameSchema);