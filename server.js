//All libraries I will use
var express		=	require ('express');
var app			= 	express();
var bodyParser	=	require('body-parser');
var api 		=	require('./api/routesApi')

//Use JSON to parse the data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':false}));

//This call allow us to call from the html all the information in public
app.use(express.static(__dirname +'/public'));


app.use('/', api);
app.listen(3000);
console.log('Listening to PORT 3000');