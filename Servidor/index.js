var express = require('express'), path = require('path'), fs = require('fs');
var bodyparser = require('body-parser');

var app = require('express')();
var servidor = require('http').createServer(app);
var io = require('socket.io').listen(servidor);
servidor.listen(3000);
console.log("conectado");

app.use(bodyparser());

app.use(express.static(__dirname + '/public'));

// CONEXION BASE DE DATOS
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

// PAGINA CLIENTE FINAL
app.get('/ClienteFinal', function(req, res){

  res.sendFile(__dirname + '/ClienteFinal/index.html');

});

// PAGINA CLIENTE MEDIO
app.get('/', function(req, res){

   res.sendFile(__dirname + '/index.html');

});

// ENSEÑAR MUJERES HOMBRES DE CADA RECINTO PARA EL CLIENTE FINAL
app.get('/listaRecintos', function(req, res) {

  // Raw query
  db.query('SELECT * FROM Recintos;').success(function(rows){
    // no errors
    console.log(rows);
    res.json(rows);

  });

});

// MUJERES HOMBRES QUE HAY EN EL RECINTO PARA EL CLIENTE MEDIO Y PODER EDITARLO
app.get('/cantidadRecinto/:recinto', function(req, res) {

  // Raw query
  db.query('SELECT Mujeres,Hombres FROM Recintos WHERE idRecintos="'+req.params.recinto+'";').success(function(rows){
    // no errors
    console.log(rows);
    res.json(rows);

  });

});


// UPDATE DE LA BASE DE DATOS CADA VEZ QUE SE LE DA AL BOTON MAS O MENOS
app.post('/modificarCantidadRecinto/:dato/:recinto', function(req, res) {

  var columna = "";
  var valor = "";

  switch(req.params.dato){

    case "mujeresMas": 
      columna = "Mujeres";
      valor = "+1";
      break;

    case "mujeresMenos":
      columna = "Mujeres";
      valor = "-1";
      break;

    case "hombresMas":
      columna = "Hombres";
      valor = "+1";
      
      break;

    case "hombresMenos":
      columna = "Hombres";
      valor = "-1";
      break;

  }

  // Raw query
  db.query('UPDATE Recintos SET ' + columna + ' = ' + columna + valor +' WHERE idRecintos="'+req.params.recinto+'";').success(function(rows){
    // no errors

   // res.sendFile(__dirname + '/ClienteMedio/index.html');

  });
 
});

io.sockets.on('connection', function(socket){
  console.log('a user connected');
   socket.on('cambiorecinto', function(msg){
    io.sockets.emit('cambiorecinto', msg);
    console.log('a user connected');
  });
});
/*
io.on('connection', function(socket){
  socket.on('cambiorecinto', function(msg){
    console.log('message: ' + msg);
  });
});
*/io.sockets.emit('some event', { for: 'everyone' });
/*
io.on('connection', function(socket){
  socket.broadcast.emit('hi');
});

io.on('connection', function(socket){
  socket.on('cambiorecinto', function(msg){
    io.emit('cambiorecinto', msg);
  });
});

var server = app.listen(process.env.PORT || 3000, function(){
    console.log('Listening in port %d', server.address().port);
});*/
