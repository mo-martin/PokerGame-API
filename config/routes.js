var express = require('express');
var router = express.Router();
var gameController = require('../controller/games');
var gameEngine = require('../gameEngine');

router.route('/Deck/new').get(gameController.create);

router.route('/Deck/shuffle/:id').get(gameController.shuffle);

router.route('Test/winConditions').post()

module.exports = router;