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
    const Utente = sequelize.define('utente', {
        id: { type: Sequelize.INTEGER, primaryKey:true },
        username : { type : Sequelize.STRING, allowNull:false },
        password : { type : Sequelize.STRING, allowNull:false },
        //mail : { type : Sequelize.STRING, allowNull:false } QUESTO MANCA A DB
        },
         {
         timestamps : false,
         freezeTableName: true
        });

    return Utente;
}