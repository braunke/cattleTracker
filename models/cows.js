/**
 * Created by kayla on 12/12/17.
 */

module.exports = function(Sequelize, sequelize) {
    return sequelize.define('cow', {
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
};
