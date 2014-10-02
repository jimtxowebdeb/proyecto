var express = require('express');
var bodyparser = require('body-parser');
var app = express();

app.use(bodyparser());

var sqlze = require('sequelize');
var db = new sqlze('proyecto', 'root', 'zubiri',{
  dialect: 'mysql',
  port: 3306
});



db
  .authenticate()
  .complete(function(err){
    if(!!err) {
      console.log('Unable to connect to database: ', err);
    } else {
      console.log('Connection OK!');
    }
  });

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', null);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/listaRecintos', function(req, res) {

  // Raw query
  db.query('SELECT * FROM Recintos;').success(function(rows){
    // no errors
    console.log(rows);
    res.json(rows);

  });

});

app.get('/cantidadRecinto/:recinto', function(req, res) {

  // Raw query
  db.query('SELECT Mujeres,Hombres FROM Recintos WHERE idRecintos="'+req.params.recinto+'";').success(function(rows){
    // no errors
    console.log(rows);
    res.json(rows);

  });

});

var server = app.listen(process.env.PORT || 3000, function(){
    console.log('Listening in port %d', server.address().port);
});