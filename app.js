const express = require('express');
const fetch = require('node-fetch');
const mysql = require('mysql2');
const Sequelize = require('sequelize');

let currentRound = null; //forse servirà


const sequelize = new Sequelize('fantatest', 'fantatest', 'inter1908', {
  host: 'db4free.net',
  dialect: 'mysql',
  timestamps : 'false',
  freezeTableName: true
});

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Starting server at ${port}`);
});

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

//Sta roba serve per evitare multiple chiamate al require
app.set('db', require('./db/dbTables')); //let utente = app.get('db').utente;


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

//CARICAMENTO MASSIVO DB IN CASO SERVA
//app.get('/scriptInsertTable', (request, response) => {
//
//    let giornata = {};
//
//    for(let i =0; i<38; i++){
//        for(let j = 1; j<=5; j++) { //ADESSO CI SONO 5 UTENTI, QUA SE SI DOVRà FARE UNA ROBA DEL GENERE SI FARà UNA QUERY SUL NUMERO DI UTENTI
//            giornata.numero_giornata = i+1;
//            giornata.punti_giornata = 0;
//            giornata.utente_id = j;
//            Giornata.create(giornata);
//        }
//
//    }
//    response.json( { "bella" : "vez" });
//});


app.post('/results/matches', async (request, response) => {
	const data = request.body.request;
    try{
    const Scommesse = app.get('db').scommessa;

	data.forEach( async (match) =>  {
        let result = await Scommesse.findOne({ where: {idMatch : match.idMatch , userId : match.userId }});
        if(!result) {
            //CREATE
            Scommesse.create(match)
            .then( () => { console.log("Record Created"); });
        }
        else {
            //UPDATE
            match.id = result.id;
            Scommesse.upsert(match)
            .then( () => { console.log("Record Updated"); });
        }
	});
    response.send("Done");

	}
	catch(e) { console.error(e); response.send(e); }
});



app.get('/calcolagiornata', (request, response) => {
	classifica = calcolagiornata();
	response.json(classifica);
});

async function calcolagiornata(){
    currentRound = 1; //TROVARE UN MODO PER CAPIRE A CHE ROUND SIAMO
    let userPoints = 0;

	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
    };
    const Scommesse = app.get('db').scommessa;
    const Giornata = app.get('db').giornata;
    const Utente = app.get('db').utente;

	let response = await fetch("https://www.thesportsdb.com/api/v1/json/1/eventsround.php?id=4332&r="+currentRound+"&s=1920", options);
	let res = await response.json();
	let results = res.events;

    let dbUsers = await Utente.findAndCountAll();

    dbUsers.rows.forEach( async (user) => {
        let dbRound = await Giornata.findOne({ where : {round : currentRound, userId : user.id}});

        let dbPredictions = await Scommesse.findAll({ where: { round : currentRound, userId : user.id }});

        if(dbPredictions) {
            userPoints += calculatePoints(dbPredictions, results);
            console.log(userPoints);
            dbRound.dataValues.points = userPoints;
            Giornata.upsert(dbRound.dataValues);
        }
    });
	return classificaJson;
}


function calculatePoints(predictions, results) {
    const Scommesse = app.get('db').scommessa;

    let points = 0;
    predictions.forEach( match => {
        results.forEach( res => {
            if(res.idEvent == match.idMatch) {
//                let prediction1x2 = calculate1x2(match.homeGoals, match.awayGoals);
                let result1x2 = calculate1x2(parseInt(res.intHomeScore), parseInt(res.intAwayScore));
                let prediction1x2 = match.bet1x2;

                if(prediction1x2 == result1x2) {
                    points += 1;
                    match.dataValues.win1x2 = true;
                    Scommesse.upsert(match.dataValues);
                    }

                if(match.homeGoals == res.intHomeScore && match.awayGoals == res.intAwayScore){
                    points +=3;
                    match.dataValues.winResult = true;
                    Scommesse.upsert(match.dataValues);
                }
            }
        });
    });
    return points;
}

function calculate1x2(homeGoals, awayGoals){ //1 is 1, 2 is 2, 0 is X
    if(homeGoals > awayGoals) return 1;
    if(homeGoals == awayGoals) return 0;
    return 2;
}



let classificaJson = { //me la calcola il db
	"standings" : 
	[
		{ "team" : "Dejan", "pres" : "Vincent", "points" : 6, "pos": "" },
		{ "team" : "Karlteam", "pres" : "Karl", "points" : 1, "pos": "" },
		{ "team" : "Barrans", "pres" : "Frindo", "points" : 3, "pos": "" }
	]
	
}