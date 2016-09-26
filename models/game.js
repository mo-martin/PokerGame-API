var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema(
{
    deck : {type : Array , required : true}
});

module.exports = mongoose.model("Game",gameSchema);