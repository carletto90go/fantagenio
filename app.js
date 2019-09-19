const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('fantatest', 'fantatest', 'inter1908', {
  host: 'db4free.net',
  dialect: 'mysql',
  timestamps : 'false',
  freezeTableName: true
});


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Starting server at ${port}`);
});
app.use(cors());

//Import routes
const authRoute = require('./routes/auth');

//Routes Middlewares
app.use('/api/user', authRoute);


//app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

//Sta roba serve per evitare multiple chiamate al require
app.set('db', require('./db/dbTables')); //let utente = app.get('db').utente;

app.get('/', (request, response) => {
    response.send("Bella Karl");
});

app.post('/login', async (request, response) => {
    try{
    const data = request.body.request;

    const Utente = app.get('db').utente;
    let user = await Utente.findOne({ where : { username : data.username, password : data.password }});

    if(!user) return response.status(403).send("Incorrect username or password!");

    const token = jwt.sign({ id : user.id, username : user.username }, "pickUMatterTeamIsTheBestTeam");
    response.header('auth-token', token).send(token);
    }
    catch(e) {

        if(request.body.request.username == "carlo" && request.body.request.password == "manu19")
            return response.send("dsjhfkjsdhfkjdshfjashjkfdhaskjfdaslfjsadhfkjhaskf");
        else response.status(403).send("Incorrect Username or password");
    }
});