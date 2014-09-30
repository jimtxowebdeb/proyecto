var express = require('express');
var app = express();

app.get('/', function(req, res) {
	
	var html = '<form action="/nombre" method="get">' +
               'Enter your name:' +
               '<input type="text" name="userName" placeholder="..." />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
	
	res.send(html);

});

app.get('/nombre', function(req,res){
	 
   var nombre = req.param('userName');

    res.send('Hola ' + nombre);
})

var server = app.listen(process.env.PORT || 3000, function(){
    console.log('Listening in port %d', server.address().port);
});