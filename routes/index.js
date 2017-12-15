var express = require('express');
var moment = require('moment');
var router = express.Router();
var models = require('../models');
//connects to the database files
var Users = models.Users;
var Types = models.Types;
var Cow = models.Cow;
var Drugs = models.Drugs;
var Treatment = models.Treatment;
//requires users to be signed in the reach certain pages
function requireLogin(req, res, next) {
    if (!(req.session && req.session.user)) {
        res.redirect('/');
    } else {
        next();
    }
}
// used this to learn sequelize http://docs.sequelizejs.com/manual/installation/getting-started
/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('index');
});
router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    Cow.destroy({where : {eartag : 2}});
    Users.findOne({where : {username : username, password : password}}).then(function(user){
        if (user){
            req.session.user = user;
            res.redirect('/homePage')
        }
        else {
            res.render('index', {'loginerror' : 'Invalid username or password'})
        }
    })
});
//shows all cows or just the filtered ones depending on your search
router.get('/homePage', requireLogin, function(req, res, next) {
    var user = req.session.user.username;
    var filter = {};
    if (req.query.searchType == 'eartag') {
        if (isNaN(req.query.searchWord)) {
            var inputMessage = "Must enter a number"
        }
        else if (req.query.searchWord) {
            filter.eartag = req.query.searchWord;
        }
    }
    if (req.query.searchType == 'description' && req.query.searchWord) {
        var key = req.query.searchWord;
        filter = {description: {like: '%' + key + '%'}}
    }
//grabs filtered cows and types to display on man page
    if (req.query.type) filter.typeId = req.query.type;
    console.log(req.query.type);
    Cow.all({where: filter, include: [Types]}).then(function (cow) {
        Types.all().then(function (types) {
            res.render('home', {'cows': cow, 'types': types, 'username': user, "errorInput": inputMessage})
        })
    });

});
router.get('/drugs', requireLogin,  function(req, res, next) {
    var user = req.session.user.username;
    Drugs.all().then(function(drugs){
        res.render('drugs', {'druglist' : drugs, username: user});
    })
});
router.get('/addCow/:eartag', requireLogin, function(req, res, next) {
    var user = req.session.user.username;
    var eartag = req.params.eartag;
    Types.all().then(function(type) {
        res.render('addCow', {'types': type, 'dameartag' : eartag, username: user})
    });
});
//shows info for a specific cow, draws info from multiple tables
router.get('/cowPage/:id', requireLogin, function(req, res, next) {
    var user = req.session.user.username;
    var cowId = req.params.id;
    Cow.findOne({where: { cowId: cowId }, include: [Types, { model: Treatment, include: [Drugs]}]}).then(function(cow){
        cow.treatments.map(function(treatment) {
            var withdrawalDate = moment(treatment.dateGiven).add(treatment.drug.withdrawalperiod, 'days');
            treatment.givendate = moment(treatment.dateGiven).format('M/D/YYYY');
            treatment.withdrawaldate = withdrawalDate.format('M/D/YYYY');
        });
        Cow.findAll({where: { damId: cow.eartag}, include: [Types]}).then(function(calf){
            res.render('cowPage', { 'cow' : cow , 'calves' : calf, username: user});
        });
    });
});
router.get('/treatment', requireLogin, function(req, res, next) {
    var user = req.session.user.username;
    Drugs.all().then(function(drugs){
        Cow.all().then(function(cows){
            res.render('treatments', {'drugs' : drugs, 'cows' : cows, username: user})
        })
    });
});
router.post('/newCow', function(req,res,next) {
    var dameartag = req.body.eartag;
    res.render('addCow', {"eartag" : dameartag})
});
//grabs info from form to enter in new cow info
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
        cowId: cowId}).then(function() {
            res.redirect('/homePage')
        })
});
router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});
module.exports = router;
