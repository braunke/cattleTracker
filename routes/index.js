var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('cattle', 'kayla', 'Hank', {
    host: 'localhost',
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
sequelize
    .authenticate()
    .then(function() {
    console.log('Connection has been established successfully.');
})
.catch(function(err) {
    console.error('Unable to connect to the database:', err);
});
var Cow = sequelize.define('cow', {
    cowid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: Sequelize.STRING
    },
    dob: {
        type: Sequelize.DATEONLY
    },
    birthing: {
        type: Sequelize.STRING
    },
    eartag: {
        type: Sequelize.INTEGER
    }
});
//Cow.sync({force: true});
//Cow.create({
//    description: 'Black cow',
//    dob: 5/12/2016,
 //   birthing: 'unassisted birth, unassisted nursing',
 //   eartag: 123
//});
/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/homePage', function(req, res, next) {
    Cow.all().then(function(cow){
        res.render('home', {'cows' : cow})
    });

    //console.log(cow + 'j');
   // res.render('home', {'cows' : cow})


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
router.get('/treatment', function(req, res, next) {
  res.render('treatments')
});
router.post('/login', function(req, res, next) {
    res.redirect('/homePage')

});
router.post('/addCow', function(req, res, next) {
  res.redirect('/addCow')
});
router.post('/treatment', function(req, res, next) {
    res.redirect('/treatments')
});
router.post('/cowPage/:id', function(req, res, next) {

})
router.post('/homePage', function(req, res, next) {
    cow = Cow.findOne()
    console.log(cow.get('eartag'))
})
module.exports = router;
