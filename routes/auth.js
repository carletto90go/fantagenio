const router = require('express').Router();
const jwt = require('jsonwebtoken');

function auth(request, response, next){
    const token = request.header('auth-token');
    if(!token) return response.status(401).send("Access Denied");
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        request.user = verified;
        next();
    }
    catch(e){ return response.status(400).send("Invalid Token"); }
}

router.use(auth);
/*
router.post('/register'), (request, response) => {
    response.send("Register");
});

router.post('/login', (request, response) => {


});
*/

router.get('/myPrediction', async (request, response) => {
    response.send("Some secret data");


});



router.get('/calcolagiornata', (request, response) => {
	classifica = calcolagiornata();
	response.json(classifica);
});


//CALCULATE CURRENTROUND, qua livello di autorizzazione più alto?
async function calcolagiornata(){
    let currentRound = 1; //TROVARE UN MODO PER CAPIRE A CHE ROUND SIAMO
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

//INSERTING MATCHES PREDICTION
router.post('/matches', async (request, response) => {
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


module.exports = router;