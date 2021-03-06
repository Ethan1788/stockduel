var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var Promise = require('bluebird');

var knex = require('../../db/index');
var usersController = require('../../db/dbcontrollers/usersController')(knex);
var app = require('../../index');

describe('/users', function () {

  var users = [{
    username: 'TESTannaUser',
    password: 'TESTannaPassword',
    name: 'TESTanna',
    email: 'TESTanna@anna'
  }, {
    username: 'TESTkateUser',
    password: 'TESTkatePassword',
    name: 'TESTkate',
    email: 'TESTkate@kate'
  }];

  // ============= Setup ============= \\
  before(function (done) {
    knex('users').insert(users, '*')
      .then(function (response) {
        users = response;
        done();
      });
  });

  // ============= Teardown ============= \\
  after(function (done) {
    Promise.map(users, function (user) {
        return knex('users').where('email', user.email).del();
      })
      .then(function () {
        done();
      });
  });

  describe('/:userId', function () {
    describe('GET', function () {

      it('responds with a 200 (OK) for valid userIds', function (done) {
        var validuserId = users[0].u_id;
        var invaliduserId = 'test1234';

        request(app)
          .get('/users/' + validuserId)
          .expect(200, done);
      });

      it('responds with a 404 (NOT FOUND) for invalid userIds', function (done) {
        var validuserId = users[0].u_id;
        var invaliduserId = 'test1234';

        request(app)
          .get('/users/' + invaliduserId)
          .expect(404, done);
      });

      it('responds with the requested user', function (done) {
        var validuserId = users[0].u_id;
        var invaliduserId = 'test1234';

        request(app)
          .get('/users/' + validuserId)
          .expect(function (res) {
            var user = res.body.data;
            expect(user.name).to.equal(users[0].name);
            expect(user.username).to.equal(users[0].username);
            expect(user.email).to.equal(users[0].email);
          })
          .expect(200, done);
      });
    });

  });

  describe('/?search=', function () {
    describe('GET', function () {
      var search = 'TEST';
      var searchCase = 'tEsT';

      it('responds with a 200 (OK)', function (done) {
        request(app)
          .get('/users/?search=' + search)
          .expect(200, done);
      });

      it('responds with stocks matching the query', function (done) {
        request(app)
          .get('/users/?search=' + search)
          .expect(function (response) {
            var users = response.body;
            expect(users).to.be.a('object');
            expect(users.data.length).to.equal(2);
          })
          .expect(200, done);
      });

      it('should be case insensitive', function (done) {
        request(app)
          .get('/users/?search=' + searchCase)
          .expect(function (response) {
            var users = response.body;
            expect(users).to.be.a('object');
            expect(users.data.length).to.equal(2);
          })
          .expect(200, done);
      });
    });
  });

});
