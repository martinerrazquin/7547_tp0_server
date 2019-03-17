module.exports = function(app, options) {
    var router = app.express.Router();

    /* GET home page. */
    router.get('/', function(req, res, next) {
      res.render('index', { title: 'Express' });
    });

    require('./books')(app, options);
};
