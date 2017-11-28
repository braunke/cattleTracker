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
    cowId: {
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
var Types = sequelize.define('types', {
    typeId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type:Sequelize.STRING
    }
});
Types.hasMany(Cow, {foreignKey: 'typeId'});
Cow.belongsTo(Types, {foreignKey: 'typeId'});
var Treatment = sequelize.define('treatment', {
    treatmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dateGiven: {
        type: Sequelize.DATE
    }

});
var Drugs = sequelize.define('drugs', {
    drugId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    purpose: {
        type: Sequelize.STRING
    },
    withdrawalperiod: {
        type: Sequelize.INTEGER
    }
});

//Treatment.sync({force : true});
//Types.sync({force : true});
//Cow.sync({force: true});
//Drugs.sync({force: true});

//Cow.create(  {
//    description: 'black cow',
//    dob: 5/12/2014,
//    birthing: 'unassisted birth, unassisted nursing',
//    eartag: 456,
//    typeId: 1,
//    damId: 1,
//    sireId:
//});
//Types.create( {
//    name: 'bull'
//});
//Drugs.create({
//    name: 'penicillin',
 //   purpose: 'treats bacterial problems',
 //   withdrawal: 5
//});
/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/homePage', function(req, res, next) {
    Cow.all().then(function(cow){
        res.render('home', {'cows' : cow})
    });
});
router.get('/drugs', function(req, res, next) {
    res.render('drugs');
});
router.get('/addCow', function(req, res, next) {
    Types.all().then(function(type) {
        res.render('addCow', {'types': type})
    });
});
router.get('/cowPage/:id', function(req, res, next) {
    var cowId = req.params.id;
    Cow.findOne({where: { cowId: cowId }, include: [Types]}).then(function(cow){
        Cow.findOne({where: { damId: cowId}}).then(function(calf){
            res.render('cowPage', { 'cow' : cow , 'calves' : calf});
        });

    });
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
