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
    const Classifica = sequelize.define('classifica', {
        id : { type: Sequelize.INTEGER, primaryKey:true },
        userId : { type : Sequelize.INTEGER, allowNull:false, field: "utente_id" },
        points : { type : Sequelize.INTEGER, allowNull:false, field: "punteggio" }
        },
         {
         timestamps : false,
         freezeTableName: true
        });

    return Classifica;
}