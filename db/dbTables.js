const Sequelize = require('sequelize');


// initialize database connection
const sequelize = new Sequelize('fantatest', 'fantatest', 'inter1908', {
   host: 'db4free.net',
   dialect: 'mysql',
   timestamps : 'false',
   freezeTableName: true
 });

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('DI****E');
  });

let models = [
    'classifica',
    'giornata',
    'scommessa',
    'utente',
];


models.forEach( model => {
  module.exports[model] = sequelize.import('./' + model); //(__dirname + '/' + model);
});

module.exports.sequelize = sequelize;