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
		for (var i = 1; i <= 5; i++) {
		  defaultPlayer = {
		    id: i,
		    hand: [],
		    chips: 5000,
		    bet: 0,
		    hasFolded: false
		  };
		  testPlayers.push(defaultPlayer);
		}
		var defaultState = 
		{
		  deck: [{suit: 'test', value: 1}, {suit: 'test', value: 1}],
		  players: testPlayers
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

	it('should give an id for the game on /Deck/new GET', function(done) {
    // create a request manager that uses our app
    var request = chai.request(app);

    // send a request
    request
      .get('/Deck/new')
      .end(function(err, res){

        // check we got a 200 response
        res.should.have.status(201);

        // and that it's json
        res.should.be.json;

        res.body.should.have.property('id');
        res.body.id.should.be.a('string');

      //remove the game
      Game.findByIdAndRemove(res.body.id, function(err) {
				if (err) console.log(err);
				done();
			});
    });
  });

it('should shuffle the deck on /Deck/:id/shuffle GET', function(done) {
    // create a request manager that uses our app
    var request = chai.request(app);

    // send a request
    request
      .get('/Deck/'+testId+'/shuffle')
      .end(function(err, res){

        // check we got a 200 response
        res.should.have.status(200);

        // and that it's json
        res.should.be.json;

        res.body.should.have.property('_id');
        res.body._id.should.be.a('string');
        expect(res.body).to.contain.keys("_id");

        done();
    });
  });

});