const Sequelize = require('sequelize');
const sequelize = require('./dbTables').sequelize;

// initialize database connection
//const sequelize = new Sequelize('fantatest', 'fantatest', 'inter1908', {
//  host: 'db4free.net',
//  dialect: 'mysql',
//  timestamps : 'false',
//  freezeTableName: true
//});

module.exports = function (sequelize, Sequelize) {
    const Scommesse = sequelize.define('scommessa',
        {      // attributes
        id : { type: Sequelize.INTEGER, primaryKey:true },
        homeTeam : { type: Sequelize.STRING, allowNull:false, field:"squadra_casa" },
        awayTeam : { type: Sequelize.STRING, allowNull:false, field:"squadra_ospite" },
        homeGoals : { type: Sequelize.INTEGER, allowNull:false, field:"punteggio_casa" },
        awayGoals : { type: Sequelize.INTEGER, allowNull:false, field:"punteggio_ospite" },
        bet1x2 : { type: Sequelize.STRING, allowNull:false, field : "1x2"},
        round : { type: Sequelize.INTEGER, allowNull:false, field:"nr_giornata" },
        winResult : { type: Sequelize.BOOLEAN, allowNull:true, field:"scommessa_vinta_re" },
        win1x2 : { type: Sequelize.BOOLEAN, allowNull:true, field:"scommessa_vinta_1x2" },
        idMatch : { type: Sequelize.INTEGER, allowNull:false, field:"codice_match" },
        userId : { type: Sequelize.INTEGER, allowNull:false, field:"utente_id" },
        //createdOn :  { type: Sequelize.INTEGER, allowNull:false },
        //modifiedOn { type: Sequelize.INTEGER, allowNull:false }
        },
        {
        timestamps : false,
        freezeTableName: true
     });
     //Scommesse.removeAttribute('id');

    return Scommesse;

    }
