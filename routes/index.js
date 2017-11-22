var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/homePage', function(req, res, next) {
  res.render('home');
});
router.get('/drugs', function(req, res, next) {
    res.render('drugs');
});
router.get('/addCow', function(req, res, next) {
  res.render('addCow')
});
router.get('/cowPage/:id', function(req, res, next) {
  var cowId = req.params.id;
  res.render('cowPage', {cowId : cowId})
});
router.post('/login', function(req, res, next) {
  res.redirect('/homePage')
});
router.post('/addCow', function(req, res, next) {
  res.redirect('/addCow')
});

module.exports = router;
