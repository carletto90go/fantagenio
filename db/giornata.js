/*
const Sequelize = require('sequelize');

   // initialize database connection
   const sequelize = new Sequelize('fantatest', 'fantatest', 'inter1908', {
     host: 'db4free.net',
     dialect: 'mysql',
     timestamps : 'false',
     freezeTableName: true
   });
  */
   var db = require('./dbTables'),
       sequelize = db.sequelize,
       Sequelize = db.Sequelize;


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


module.exports = User;