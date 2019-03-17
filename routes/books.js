module.exports = function(app) {
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

    app.options.booksService.search(query.query, {
      offset: (query.page - 1) * 10
    }, function(err, result) {
      if (!err) {
        res.json({result: result});
      } else {
        res.status(500).send();
      }
    });
  });

  router.get('/:id', function(req, res, next) {
    app.options.booksService.lookup(req.params.id, function(err, result) {
      if (!err) {
        res.json({result: result});
      } else {
        res.status(404).send();
      }
    });
  });

  app.use('/books', router);
};
