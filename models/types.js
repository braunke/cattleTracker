/**
 * Created by kayla on 12/12/17.
 */

module.exports = function(Sequelize, sequelize) {
    return sequelize.define('types', {
        typeId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        }
    });
};