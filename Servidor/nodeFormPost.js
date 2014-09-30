var express = require('express');
var bodyparser = require('body-parser');
var app = express();
app.use(bodyparser());

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

app.get('/listarecintos', function(req, res) {

/*  var id = req.params.id;
  // Raw query
  db.query('SELECT * FROM tablename WHERE id='+ id).success(function(rows){
    // no errors
    console.log(rows);
    res.json(rows);
    // res.json(JSON.stringify(rows));
  });*/
var recintos = {"bares":["Iturtxo","Tamer","Aralar"]};

res.json(recintos);
});

var server = app.listen(process.env.PORT || 3000, function(){
    console.log('Listening in port %d', server.address().port);
});