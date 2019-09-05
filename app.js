const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
const mysql = require('mysql2');

let currentRound = null;

const app = express();
const port = process.env.PORT || 3000;


let connection = mysql.createConnection( {
	host     : "db4free.net",
	user     : "fantatest",
	password : "inter1908",
	database : "fantatest"
	
} );


connection.connect((err) => {
  if (err) console.log( err.stack );
  else console.log('Connected!');
});

connection.query('SELECT * FROM utente WHERE 1', (err, res, fields) => {
	console.log("---------------------Check 1-----------------");
	console.log(res);
	console.log("---------------------Check 1-----------------");
	console.log(fields);
	console.log("---------------------Check 1-----------------");
	console.log(err);
} );

app.listen(port, () => {
	console.log(`Starting server at ${port}`);
});




app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

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

app.post('/apipost', (request, response) => {
	const data = request.body;
	console.log(request.body);
	//DATABASE SAVE (id,squadra_casa,squadra_ospite,punteggio_casa,punteggio_ospite,1x2,giornata_id,utente_id,data_inserimento)
	
	let sqlQuery = "INSERT INTO scommessa VALUES (?,?,?,?,?,?,?,?,?)"; 
	let d = new Date().toISOString();
	connection.query(sqlQuery,[1,"home","away",3,1,"1",1,1,d], (err, rows, fields) => {
		console.log("---------------------Check-----------------");
		console.log(rows);
		console.log("---------------------Check-----------------");
		console.log(fields);
		console.log("---------------------Check-----------------");
		console.log(err);	
	});
	
	/*
	pst.setInt(1, 1);
	pst.setString(2, "home");
	pst.setString(3, "away");
	pst.setInt(4, data.homeGoals);
	pst.setInt(5, data.awayGoals);
	pst.setString(6, "X");
	pst.setInt(7, 1);
	pst.setInt(8, 1);
	pst.setDate(9, Date.now());
	
	pst.executeUpdate();
	*/
	

	
	database.insert(data);
	
	database.findOne( { idmatch : data.idmatch }, (err, d) => { //sta roba cerca nel db l'id del match appena inserito
			response.json(d._id);
	});
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


/*
let nextMatches = {
	"round" : 2,
	"matches" : 
		[
			{ "match" : "Inter vs Juventus", "id" : 0 },
			{ "match" : "Milan vs Lecce", "id" : 11 },
			{ "match" : "Roma vs Torino", "id" : 22 },
			{ "match" : "Napoli vs Bologna", "id" : 33 },
			{ "match" : "Parma vs Carpi", "id" : 44 }
		]
}
*/
let pastMatches = {
	"round" : 1,
	"results" : 
	[
		{ 
			"id" : 0,
			"match" : "Inter vs Juventus",
			"homegoals" : 4,
			"awaygoals" : 0,
			"round" : 1
		},
		{ 
			"id" : 11,
			"match" : "Milan vs Lecce",
			"homegoals" : 3,
			"awaygoals" : 4,
			"round" : 1
		},
		{ 
			"id" : 22,
			"match" : "Roma vs Torino",
			"homegoals" : 3,
			"awaygoals" : 2,
			"round" : 1
		},
		{ 
			"id" : 33,
			"match" : "Napoli vs Bologna",
			"homegoals" : 1,
			"awaygoals" : 1,
			"round" : 1
		},
		{ 
			"id" : 44,
			"match" : "Parma vs Carpi",
			"homegoals" : 4,
			"awaygoals" : 2,
			"round" : 1
		}	
	]
}