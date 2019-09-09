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
        //id : {},
        squadra_casa : { type: Sequelize.STRING, allowNull:false },
        squadra_ospite : { type: Sequelize.STRING, allowNull:false },
        punteggio_casa : { type: Sequelize.INTEGER, allowNull:false },
        punteggio_ospite : { type: Sequelize.INTEGER, allowNull:false },
        _1x2 : { type: Sequelize.STRING, allowNull:false, field : "1x2"},
        nr_giornata : { type: Sequelize.INTEGER, allowNull:false },
        //scommessa_vinta_re : { type: Sequelize.BOOLEAN, allowNull:false },
        //scommessa_vinta_1x2 : { type: Sequelize.BOOLEAN, allowNull:false },
        codice_match : { type: Sequelize.INTEGER, allowNull:false },
        utente_id : { type: Sequelize.INTEGER, allowNull:false },
        //creato :  { type: Sequelize.INT, allowNull:false },
        //modificato: { type: Sequelize.INT, allowNull:false }
        },
        {
        timestamps : false,
        freezeTableName: true
     });
     Scommesse.removeAttribute('id');

    return Scommesse;

    }
