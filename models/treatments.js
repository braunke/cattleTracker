/**
 * Created by kayla on 12/12/17.
 */

module.exports = function(Sequelize, sequelize) {
    return sequelize.define('treatment', {
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
};