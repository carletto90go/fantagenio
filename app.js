const express = require('express');
const fetch = require('node-fetch');
const mysql = require('mysql2');

const Sequelize = require('sequelize');

const sequelize = new Sequelize('fantatest', 'fantatest', 'inter1908', {
  host: 'db4free.net',
  dialect: 'mysql',
  timestamps : 'false',
  freezeTableName: true
});







let currentRound = null;

const app = express();
const port = process.env.PORT || 3000;


//let connection = mysql.createConnection( {
//	host     : "db4free.net",
//	user     : "fantatest",
//	password : "inter1908",
//	database : "fantatest"
//
//} );
//
//
//connection.connect((err) => {
//  if (err) console.log( err.stack );
//  else console.log('Connected!');
//});


app.listen(port, () => {
	console.log(`Starting server at ${port}`);
});




app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

//Sta roba serve per evitare multiple chiamate al require
app.set('db', require('./db/dbTables')); //let utente = app.get('db').utente;

let Giornata = app.get('db').giornata;

async function getNextMatches(){
	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
    };
	let response = await fetch("https://www.thesportsdb.com/api/v1/json/1/eventsnextleague.php?id=4332", options);
	let res = await response.json();
	
	let results = res.events;
	
	let nextMatches = {};
	
	nextMatches.matches = [];
	
	nextMatches.round = results[0].intRound;
	
	for (let i =0; i<10; i++) { //In Serie A ci sono 10 partite (20 squadre)
		nextMatches.matches.push({
			"match": results[i].strEvent,
			"id": results[i].idEvent,
			"awayTeam" : results[i].strAwayTeam,
			"homeTeam" : results[i].strHomeTeam,
			"matchDate" : results[i].dateEvent
			});
		}
	
	if(nextMatches.round == 1) 
		currentRound = 38; //sempre solo caso serie A
	else currentRound = nextMatches.round - 1;
	
	return nextMatches;
	
}

async function getPastMatches(){

	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
    };
	let response = await fetch("https://www.thesportsdb.com/api/v1/json/1/eventsround.php?id=4332&r="+currentRound+"&s=1920", options);
	let res = await response.json();
	
	let results = res.events;
	
	let pastMatches = {};
	
	pastMatches.matches = [];
	
	pastMatches.round = currentRound;
	
	for (let i =0; i<10; i++) { //In Serie A ci sono 10 partite (20 squadre)
		pastMatches.matches.push({
			"match": results[i].strEvent,
			"id": results[i].idEvent,
			"awayTeam" : results[i].strAwayTeam,
			"homeTeam" : results[i].strHomeTeam,
			"matchDate" : results[i].dateEvent,
			"homeGoals" : results[i].intHomeScore,
			"awayGoals" : results[i].intAwayScore
			});
		}
	
	return pastMatches;
}

app.get('/nextmatches', (request, response) => {
	getNextMatches()
	.then( res => { //nextMatches
		response.json(res);
	});
	
	
});

app.get('/pastmatches', (request, response) => {
	if(currentRound != null){
		getPastMatches()
		.then( res => {
			response.json(res);
		});
		
	
	}
});

app.get('/scriptInsertTable', (request, response) => {
/*
    let giornata = {};

    for(let i =0; i<38; i++){
        for(let j = 1; j<=5; j++) { //ADESSO CI SONO 5 UTENTI, QUA SE SI DOVRà FARE UNA ROBA DEL GENERE SI FARà UNA QUERY SUL NUMERO DI UTENTI
            giornata.numero_giornata = i+1;
            giornata.punti_giornata = 0;
            giornata.utente_id = j;
            Giornata.create(giornata);
        }

    }*/
    response.json( { "bella" : "vez" });

});

app.post('/apipost', (request, response) => {
	const data = request.body;

	console.log(request.body);
    const Scommesse = app.get('db').scommessa;

    console.log(Scommesse);
    let match = {};

    match.squadra_casa = "Home Team";
    match.squadra_ospite = "Away Team";
    match.punteggio_casa = data.homegoals;
    match.punteggio_ospite = data.awaygoals;
    match._1x2 = "1";
    match.nr_giornata = 1;
    match.codice_match = data.idmatch;
    match.utente_id = 1;

	Scommesse.create(match);

	response.json({"bella" : "vez"});
});


app.get('/calcolagiornata', (request, response) => {
	classifica = calcolagiornata();
	response.json(classifica);
});

function calcolagiornata(){
	
	return classificaJson;
}


let classificaJson = { //me la calcola il db
	"standings" : 
	[
		{ "team" : "Dejan", "pres" : "Vincent", "points" : 6, "pos": "" },
		{ "team" : "Karlteam", "pres" : "Karl", "points" : 1, "pos": "" },
		{ "team" : "Barrans", "pres" : "Frindo", "points" : 3, "pos": "" }
	]
	
}