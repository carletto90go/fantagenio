const express = require('express');
const router = express.Router();

const Sequelize = require('sequelize');

const sequelize = new Sequelize('fantatest', 'fantatest', 'inter1908', {
  host: 'db4free.net',
  dialect: 'mysql',
  timestamps : 'false',
  freezeTableName: true
});

router.post('./match', (request, response) => {
	const data = request.body;
    try{

        const Scommesse = app.get('db').scommessa;

        let match = {};

        match.squadra_casa = data.homeTeam;
        match.squadra_ospite = data.awayTeam;
        match.punteggio_casa = data.homeGoals;
        match.punteggio_ospite = data.awayGoals;
        match._1x2 = data._1x2;
        match.nr_giornata = data.round;
        match.codice_match = data.idMatch;
        match.utente_id = data.user;

        Scommesse.create(match);
    }
    catch(e){
        console.error(e);
    }

	response.send("Bella vez");
});