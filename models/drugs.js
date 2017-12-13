/**
 * Created by kayla on 12/12/17.
 */

module.exports = function(Sequelize, sequelize) {
    return sequelize.define('drugs', {
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
};