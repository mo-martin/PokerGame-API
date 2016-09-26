var express = require('express');
var router = express.Router();
var gameController = require('../controller/games');

router.route('/Deck/new').get(gameController.create);

router.route('/Deck/shuffle/:id').get(gameController.shuffle);

module.exports = router;