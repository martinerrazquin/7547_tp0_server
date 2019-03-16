var express = require('express');
var router = express.Router();

router.get('/search', function(req, res, next) {
  res.send({
    results: [
      {name: "some book"}, 
      {name: "some other book"}
    ]
  });
});

router.get('/:id', function(req, res, next) {
  res.send({
    id: req.params.id,
    name: "some book",
    author: "the author",
    publication_date: "01/01/1900"
  });
});

module.exports = router;
