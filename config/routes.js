var express = require('express');
var router = express.Router();
var gameController = require('../controller/games');

router.route('/Deck/new').get(gameController.create);

module.exports = router;