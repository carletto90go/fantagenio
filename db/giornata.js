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
        id : { type : Sequelize.INTEGER, primaryKey:true },
        round : { type : Sequelize.INTEGER, allowNull:false, field: "nr_giornata" },
        points : { type : Sequelize.INTEGER, allowNull:false, field: "punti_giornata" },
        userId : { type : Sequelize.INTEGER, allowNull:false, field: "utente_id" },
        },
         {
         timestamps : false,
         freezeTableName: true
        });

    return Giornata;
}