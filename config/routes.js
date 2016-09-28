var express = require('express');
var router = express.Router();
var gameController = require('../controller/games');
var playerController = require('../controller/players');
var gameEngine = require('../gameEngine');

router.route('/Deck/new').get(gameController.create);

router.route('/Deck/:id/deal').get(gameController.deal);

router.route('/Deck/:id/shuffle').get(gameController.shuffle);

//player controller
router.route('/game/:gameId/player/:playerId/fold').get(playerController.fold);
router.route('/game/:gameId/player/:playerId/:bet').get(playerController.bet);

router.route('Test/winConditions').post(gameEngine)

module.exports = router;