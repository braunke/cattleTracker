var express = require('express');
var moment = require('moment');
var router = express.Router();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('cattle', 'kayla', 'Hank', {
    host: 'localhost',
    dialect: 'postgres',

    pool: {
        max: 100,
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
    },
    damId: {
        type: Sequelize.INTEGER
    },
    sireId: {
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
    },
    notes: {
        type: Sequelize.STRING
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
Drugs.hasMany(Treatment, {foreignKey: 'drugId'});
Treatment.belongsTo(Drugs, {foreignKey: 'drugId'});
Cow.hasMany(Treatment, {foreignKey: 'cowId'});
Treatment.belongsTo(Cow, {foreignKey: 'cowId'});
//Treatment.sync({force : true});
//Types.sync({force : true});
//Cow.sync({force: true});
//Drugs.sync({force: true});

//Types.create( {
//    name: 'steer'
//});
//Drugs.create({
//    name: 'penicillin',
//    purpose: 'treats bacterial problems',
//    withdrawalperiod: 30
//});
/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
//shows all cows or just the filtered ones depending on your search
router.get('/homePage', function(req, res, next) {
    var filter = {};
    if (req.query.eartag) filter.eartag = req.query.eartag;
    if (req.query.type) filter.typeId = req.query.type;
    Cow.all({where: filter, include: [Types]}).then(function(cow){
        Types.all().then(function(types){
            res.render('home', {'cows' : cow, 'types' : types})
        })
    });
});
router.get('/drugs', function(req, res, next) {
    Drugs.all().then(function(drugs){
        res.render('drugs', {'druglist' : drugs});
    })
});
router.get('/addCow/:eartag', function(req, res, next) {
    var eartag = req.params.eartag;
    Types.all().then(function(type) {
        res.render('addCow', {'types': type, 'dameartag' : eartag})
    });
});
router.get('/cowPage/:id', function(req, res, next) {
    var cowId = req.params.id;
    Cow.findOne({where: { cowId: cowId }, include: [Types, { model: Treatment, include: [Drugs]}]}).then(function(cow){
        cow.treatments.map(function(treatment) {
            var withdrawalDate = moment(treatment.dateGiven).add(treatment.drug.withdrawalperiod, 'days');
            treatment.givendate = moment(treatment.dateGiven).format('M/D/YYYY');
            treatment.withdrawaldate = withdrawalDate.format('M/D/YYYY');
        });
        Cow.findAll({where: { damId: cow.eartag}, include: [Types]}).then(function(calf){
            res.render('cowPage', { 'cow' : cow , 'calves' : calf});
        });
    });
});
router.get('/treatment', function(req, res, next) {
    Drugs.all().then(function(drugs){
        Cow.all().then(function(cows){
            res.render('treatments', {'drugs' : drugs, 'cows' : cows})
        })
    });
});
router.post('/login', function(req, res, next) {
    res.redirect('/homePage')
});
router.post('/all', function(req, res, next) {
    res.redirect('/homePage')
});
router.post('/druglist', function(req,res,next) {
    res.redirect('drugs')
});
router.post('/newCow', function(req,res,next) {
    var dameartag = req.body.eartag;
    res.render('addCow', {"eartag" : dameartag})
});
router.post('/addCow', function(req, res, next) {
    var damId = req.body.dameartag;
    var sireId = req.body.sireeartag;
    var eartag = req.body.eartag;
    var description = req.body.description;
    var type = req.body.typeId;
    var birthing = req.body.birth;
    var dob = req.body.dob;
    Cow.findAll({where: {eartag: eartag}}).then(function(cow) {
        console.log(cow);
        if(cow === []){
            res.render('addCow', {"message": "A cow with that eartag exists already, choose a different number"})
        }
        else {
            Cow.create({
                description: description,
                dob: dob,
                birthing: birthing,
                eartag: eartag,
                typeId: type,
                damId: damId,
                sireId: sireId
            }).then(
                res.redirect('/homePage')
            )
        }
    });
});
router.post('/treatment', function(req, res, next) {
    var dateGiven = req.body.dateGiven;
    var notes = req.body.notes;
    var drug = req.body.drugId;
    var cowId = req.body.cowId;
    console.log(cowId);
    Treatment.create({
        dateGiven : dateGiven,
        notes: notes,
        drugId: drug,
        cowId: cowId}).then(
    res.redirect('/homePage')
    )
});
router.post('/homePage', function(req, res, next) {
});
module.exports = router;
