
var buildResponse = function(err, result) {
    var response = {};

    if (!err) {
      response.result = result;
    } else {
      response.error = err;
    }

    return response;
}

module.exports = function(app, options) {
  var router = app.express.Router();

  router.get('/search', function(req, res, next) {
    options.booksService.search(req.query.query, function(err, results) {
      res.json(buildResponse(err, results));
    });
  });

  router.get('/:id', function(req, res, next) {
    options.booksService.lookup(req.params.id, function(err, result) {
      res.json(buildResponse(err, result));
    });
  });

  app.use('/books', router);
};
