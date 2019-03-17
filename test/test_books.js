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
  '2': {id: '2', title: 'Another title'}
};

app.options.booksService = {
  lookup: function(id, callback) {
    var error = id == '1' || id == '2' ? null : {};
    var response = books[id];
    callback(error, response);
  },
  search: function(query, options, callback) {
    var error = null;
    var response = [];

    switch (query) {
      case 'title':
        response.push(books[0]);
        response.push(books[1]);
        break;
      case 'A Title':
        response.push(books[0]);
        break;
      case 'nonexistant':
        break;
      default:
        error = {};
        break;
    }

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

  describe("GET /books/search", () => {
    it("should get valid search with multiple results", (done) => {
      chai.request(app)
        .get('/books/search')
        .query({query: 'title'})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          chai.expect(res.body.result.length).to.equal(2);
          done();
        });
    });

    it("should get valid search with a single result", (done) => {
      chai.request(app)
        .get('/books/search')
        .query({query: 'A Title'})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          chai.expect(res.body.result.length).to.equal(1);
          done();
        });
    });

    it("should not get invalid search", (done) => {
      chai.request(app)
        .get('/books/search')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          chai.expect(res.body.error).to.equal('NO_QUERY');
          done();
        });
    });

    it("should not get valid search with no results", (done) => {
      chai.request(app)
        .get('/books/search')
        .query({query: 'nonexistant'})
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it("should fail when books service fails", (done) => {
      chai.request(app)
        .get('/books/search')
        .query({query: 'service fail'})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });
});