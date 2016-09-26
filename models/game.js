var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema(
{
    Deck : {type : Array , required : true}
});

module.exports = mongoose.model("Game",gameSchema);