var express = require('express'), path = require('path'), fs = require('fs'), exphbs = require('express-handlebars');
var bodyparser = require('body-parser');

var app = require('express')();
var servidor = require('http').createServer(app);
var io = require('socket.io').listen(servidor);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

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
app.get('/clienteFinal', function(req, res){

  res.sendFile(__dirname + '/ClienteFinal/index.html');

});

// PAGINA RECINTO
app.get('/recinto/:recinto', function(req, res){
  var recinto = {recinto: req.params.recinto};
  res.render('recinto', recinto);

});

// PAGINA LOGIN
app.get('/', function(req, res){

res.render('login');

});

app.get('/login/:error', function(req, res){

  var error = {error: req.params.error};
  res.render('login',error);

});

// ENCRIPTAR CONTRASEÑA EN NODE

function encriptar(user, pass) {
   var crypto = require('crypto')
   // usamos el metodo CreateHmac y le pasamos el parametro user y actualizamos el hash con la password
   var hmac = crypto.createHmac('sha1', user).update(pass).digest('hex')
   return hmac
}

// TRATAMIENTO ENVIO DE LOGIN
app.post('/log', function(req, res){
 
  db.query('SELECT Password, idUsuarios FROM Usuarios where User="'+ req.param("usuario")+'";').success(function(rows){
    // no errors
    var usuario = req.param("usuario");
    var password = req.param("pass");

    var pass = encriptar(usuario, password);

    if(rows[0].Password.toString() == pass){
      
      db.query('SELECT idRecinto FROM Login where idUsuarios="'+ rows[0].idUsuarios+'";').success(function(rowsa){
        // no errors
        var idRec = rowsa[0].idRecinto.toString();
         res.redirect('/recinto/'+idRec);
      });

    }else{
      res.redirect('/login/'+"Password incorrecto");
    }

    }).error(function (err){
        res.redirect('/login/'+ "Usuario incorrecto");
  });
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
 db.query('SELECT '+ columna+' FROM Recintos WHERE idRecintos="'+req.params.recinto+'";').success(function(rows){
    // no errors
      io.sockets.emit('cambiorecinto', {"id":req.params.recinto,"columna":columna, "numero": rows});

  });
});

/*
var server = app.listen(process.env.PORT || 3000, function(){
    console.log('Listening in port %d', server.address().port);
});*/