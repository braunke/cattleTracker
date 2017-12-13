/**
 * Created by kayla on 12/12/17.
 */

module.exports = function(Sequelize, sequelize) {
    return sequelize.define('users', {
        userId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {type: Sequelize.STRING},
        password: {type: Sequelize.STRING}
    });
};