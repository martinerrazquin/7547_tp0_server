
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
    var defaultQuery = {page: 1};
    var query = {...defaultQuery, ...req.query};

    if (!query.query) {
      res.status(400).json({
        error: "NO_QUERY"
      });
      return;
    }

    options.booksService.search(query.query, {
      offset: (query.page - 1) * 10
    }, function(err, results) {
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
