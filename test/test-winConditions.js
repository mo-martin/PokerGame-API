var chai = require('chai');
var chaiHttp= require('chai-http');
var app = require('../app');
var should = chai.should();
var expect = chai.expect;

var Game = require('../models/game');

var testId;

chai.use(chaiHttp);

describe('Deck', function() {
	before(function(done){
		var testPlayers = [];
		var defaultPlayer;
		  defaultPlayer = {
		    id: 1,
		    hand: [{suit:'S',value:1},{suit:'C',value:1}],
		    chips: 5000,
		    bet: 250,
		    hasFolded: false
          };
		  testPlayers.push(defaultPlayer);
          defaultPlayer = {
		    id: 2,
		    hand: [{suit:'S',value:8},{suit:'C',value:8}],
		    chips: 5000,
		    bet: 300,
		    hasFolded: false
          };
		  testPlayers.push(defaultPlayer);
          defaultPlayer = {
		    id: 3,
		    hand: [{suit:'D',value:8},{suit:'C',value:3}],
		    chips: 5000,
		    bet: 500,
		    hasFolded: false
          };
		  testPlayers.push(defaultPlayer);
          defaultPlayer = {
		    id: 4,
		    hand: [{suit:'D',value:2},{suit:'S',value:3}],
		    chips: 5000,
		    bet: 500,
		    hasFolded: false
          };
		  testPlayers.push(defaultPlayer);
          defaultPlayer = {
		    id: 5,
		    hand: [{suit:'D',value:3},{suit:'H',value:4}],
		    chips: 5000,
		    bet: 500,
		    hasFolded: false
          };
		  testPlayers.push(defaultPlayer);
          defaultPlayer = {
		    id: 6,
		    hand: [{suit:'C',value:12},{suit:'C',value:3}],
		    chips: 5000,
		    bet: 500,
		    hasFolded: false
          };
		  testPlayers.push(defaultPlayer);
		var defaultState = 
		{
		  deck: [{suit: 'test', value: 1}, {suit: 'test', value: 1}],
          boardPile : [{suit:'H',value:1},{suit:'D',value:1},{suit:'H',value:8},{suit:'D',value:13},{suit:'H',value:2}],
		  players: testPlayers,
          gameState: 5,
          curBet: 500,
          pot: 2550
		};
		Game.create(defaultState,function(err,result) {
			testId = result._id;
			console.log("created test game");
			done();
		});
	});

    after(function(done) {
		Game.findByIdAndRemove(testId, function(err) {
			if (err) console.log(err);
			console.log("removed test game");
			done();
		});
	});

    it('should give winning player results  /Deck/:id/deck GET', function(done) {
    // create a request manager that uses our app
    var request = chai.request(app);

    // send a request
    request
      .get('/Deck/'+testId+'/deal')
      .end(function(err, res){

        // check we got a 200 response
        res.should.have.status(200);

        // and that it's json
        res.should.be.json;
        //console.log(res.body);
        // expect(res.body).to.contain.keys('Player');
        // expect(res.body._id).to.be.a('string');
        Game.findById(testId,function(err,result)
        {
            expect(Game.findById(testId).players[0].chips).to.equal(6500);
            expect(Game.findById(testId).players[1].chips).to.equal(5250);
            expect(Game.findById(testId).players[2].chips).to.equal(5800);
            expect(Game.findById(testId).players[3].chips).to.equal(4500);
            expect(Game.findById(testId).players[4].chips).to.equal(4500);
            expect(Game.findById(testId).players[5].chips).to.equal(4500);
        });

        done();
    });
  });
})