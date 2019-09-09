const Sequelize = require('sequelize');
const sequelize = require('./dbTables').sequelize;

 //initialize database connection
//const sequelize = new Sequelize('fantatest', 'fantatest', 'inter1908', {
//  host: 'db4free.net',
//  dialect: 'mysql',
//  timestamps : 'false',
//  freezeTableName: true
//});

module.exports = function (sequelize, Sequelize) {
    const Giornata = sequelize.define('giornata', {
        numero_giornata : { type : Sequelize.INTEGER, allowNull:false },
        punti_giornata : { type : Sequelize.INTEGER, allowNull:false },
        utente_id : { type : Sequelize.INTEGER, allowNull:false },
        },
         {
         timestamps : false,
         freezeTableName: true
        });
    Giornata.removeAttribute('id');

    return Giornata;
}