const express = require('express');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

router.use(express.json({ limit: '1mb' }));

const app = express();
app.set('db', require('../db/dbTables'));

//todo se riesci per ogni funzione descrivi cosa sono i parametri (in questo caso predictions e results) e cosa ritorna la funzione
function auth(request, response, next){
    let token = request.header('auth-token');
    if(!token) {
        return response.status(401).send("Access Denied");
    }
    try {
        let verified = jwt.verify(token, "pickUMatterTeamIsTheBestTeam");
        request.user = verified;
        next(); //todo a cosa serve?
    } catch(e) {
        return response.status(400).send("Invalid Token");
    }
}

router.use(auth);
/*
router.post('/register'), (request, response) => {
    response.send("Register");
});
*/

router.get('/myPrediction', async (request, response) => {
    response.send("Some secret data");
});

router.get('/calcolagiornata', async (request, response) => {
	//if(!calcolagiornata()) { return response.status(400).send("Something gone wrong! Calcolo"); };

    let currentRound = 1;

    let Giornata = app.get('db').giornata;
    let Classifica = app.get('db').classifica;

    let dbResultClassifica = await Classifica.findAll();

    dbResultClassifica.forEach( async (user) => { //todo non essendo un item della tabella delle utenze converrebbe cambiare nome: user => userRanking
        let dbResultGiornata = await Giornata.findOne({ where: { userId : user.id, round : currentRound }});
        //todo non si punta mai verso le proprietà degli oggetti. Si utilizza sempre e solo le funzioni getter e setter.
        //todo in questo caso dovresti fare: totalPoints = user.points + dbResultGiornata.points; se non funziona user.point utilizza il getter ed il setter (https://sequelize.org/master/manual/models-definition.html#getters--amp--setters)
        //todo se scrivi questa riga dovresti eliminare le 2 sotto: user.update({points: totalPoints}).then(() => {});
        user.dataValues.points += dbResultGiornata.points;
        Classifica.upsert(user.dataValues);
    });

    dbResultClassifica = await Classifica.findAll();

    let jsonResponse = [];

    dbResultClassifica.forEach( item => { //todo come sopra: user => userRanking
        jsonResponse.push( {id : item.id, userId : item.userId, points : item.points } );
    });
	response.json(jsonResponse);
});


//CALCULATE CURRENTROUND, qua livello di autorizzazione più alto?
async function calcolagiornata(){ //todo cambia il nome della funzione in calcolaGiornata e se è possibile scrivi variabili e funzioni in inglese!
    let currentRound = 1; //TROVARE UN MODO PER CAPIRE A CHE ROUND SIAMO
    let userPoints = 0;

	let options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
    };

	let response = await fetch("https://www.thesportsdb.com/api/v1/json/1/eventsround.php?id=4332&r="+currentRound+"&s=1920", options);
	let res = await response.json();
	let results = res.events;

    const Scommesse = app.get('db').scommessa;
    const Giornata = app.get('db').giornata;
    const Utente = app.get('db').utente;

    try {
        let dbUsers = await Utente.findAndCountAll(); //todo da cambiare con .findAll()

        dbUsers.rows.forEach( async (user) => {
            let dbRound = await Giornata.findOne({ where : {round : currentRound, userId : user.id}});
            let dbPredictions = await Scommesse.findAll({ where: { round : currentRound, userId : user.id }});

            if(dbPredictions) {
                userPoints += calculatePoints(dbPredictions, results);
                console.log(userPoints);
                //todo se scrivi questa riga dovresti eliminare le 2 sotto: dbRound.update({points: userPoints}).then(() => {});
                dbRound.dataValues.points = userPoints;
                Giornata.upsert(dbRound.dataValues);
            }
        });
    } catch(e) {
        console.log(e);
        return false;
    }
    //todo questo return potresti metterlo direttamente all'interno del try.
    return true;
}
//todo se riesci per ogni funzione descrivi cosa sono i parametri (in questo caso predictions e results) e cosa ritorna la funzione
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
                    //todo come sopra match.update({win1x2: true}).then(() => {});
                    match.dataValues.win1x2 = true;
                    Scommesse.upsert(match.dataValues);
                }

                if(match.homeGoals == res.intHomeScore && match.awayGoals == res.intAwayScore){
                    points +=3;
                    //todo come sopra match.update({winResult: true}).then(() => {});
                    match.dataValues.winResult = true;
                    Scommesse.upsert(match.dataValues);
                }
            }
        });
    });
    return points;
}

//todo se riesci per ogni funzione descrivi cosa sono i parametri (in questo caso predictions e results) e cosa ritorna la funzione
function calculate1x2(homeGoals, awayGoals){ //1 is 1, 2 is 2, 0 is X
    if(homeGoals > awayGoals)
        return 1;
    if(homeGoals == awayGoals)
        return 0;
    return 2;
}

//INSERTING MATCHES PREDICTION
router.post('/matches', async (request, response) => {
	const data = request.body.request;
    try {
        const Scommesse = app.get('db').scommessa;
        //todo che oggetto è data? come per le funzioni potresti mettere un commento sopra per far capire che tipo di oggetto è data
        data.forEach( async (match) =>  {
            let result = await Scommesse.findOne({ where: {idMatch : match.idMatch , userId : match.userId }});
            if(!result) {
                //CREATE
                Scommesse.create(match)
                .then( () => {
                    console.log("Record Created");
                });
            } else {
                //UPDATE
                //todo come sopra match.update({id: result.id}).then(() => { console.log("Record Updated"); });
                //todo stai cambiando l'id chiave del record?
                match.id = result.id;
                Scommesse.upsert(match)
                .then( () => { console.log("Record Updated"); });
            }
        });
        response.send("Done");
	} catch(e) {
	    console.error(e);
	    response.send(e);
	}
});

module.exports = router;