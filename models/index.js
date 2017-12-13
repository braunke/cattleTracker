var Sequelize = require('sequelize');

var sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    pool: {
        max: 100,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

var Cow = require('./cows')(Sequelize, sequelize);
var Drugs = require('./drugs')(Sequelize, sequelize);
var Treatment = require('./treatments')(Sequelize, sequelize);
var Types = require('./types')(Sequelize, sequelize);
var Users = require('./users')(Sequelize, sequelize);

Types.hasMany(Cow, {foreignKey: 'typeId'});
Cow.belongsTo(Types, {foreignKey: 'typeId'});
Drugs.hasMany(Treatment, {foreignKey: 'drugId'});
Treatment.belongsTo(Drugs, {foreignKey: 'drugId'});
Cow.hasMany(Treatment, {foreignKey: 'cowId'});
Treatment.belongsTo(Cow, {foreignKey: 'cowId'});

sequelize
    .authenticate()
    .then(function() {
        console.log('Connection has been established successfully.');
        // prepopulate(true);
    })
    .catch(function(err) {
        console.error('Unable to connect to the database:', err);
    });

function prepopulate(sync) {
    if (sync) {
        Users.sync({force : true}).then(prepopulateUsers);
        Types.sync({force : true}).then(prepopulateTypes);
        Cow.sync({force: true});
        Drugs.sync({force: true}).then(prepopulateDrugs);
        Treatment.sync({force : true});
    } else {
        prepopulateUsers();
        prepopulateTypes();
        prepopulateDrugs();
    }
}

function prepopulateUsers() {
    Users.create({
        username: 'Kayla',
        password: 'Hank'
    });
}

function prepopulateTypes() {
    Types.create( {
        name: 'steer'
    });
}

function prepopulateDrugs() {
    Drugs.create({
        name: 'penicillin',
        purpose: 'treats bacterial problems',
        withdrawalperiod: 30
    });
}

module.exports = {
    Users: Users,
    Types: Types,
    Cow: Cow,
    Drugs: Drugs,
    Treatment: Treatment
};