// Import the dependencies for testing
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');

// Configure chai
chai.use(chaiHttp);
chai.should();

// Mock the books service
var books = {
  '1': {id: '1', title: 'A title'},
  '2': {id: '2', title: 'A title'}
};

app.options.booksService = {
  lookup: function(id, callback) {
    var error = id == '1' || id == '2' ? null : {};
    var response = books[id];
    callback(error, response);
  }
}

describe("Books", () => {
  describe("GET /books/:id", () => {
    it("should get book with valid id", (done) => {
      const id = 1;
      chai.request(app)
        .get(`/books/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it("should not get book with invalid id", (done) => {
      const id = 5;
      chai.request(app)
        .get(`/books/${id}`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
     });
  });
});