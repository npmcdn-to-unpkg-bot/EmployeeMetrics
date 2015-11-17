//All libraries I will use
var express			=	require ('express');
var app				= 	express();
var bodyParser		=	require('body-parser');
var api 			=	require('./server/routesApi');
var cookieParser 	= 	require('cookie-parser');
var session 		= 	require('express-session');
var morgan 			= 	require('morgan');
var passport 		= 	require('passport');

//Use JSON to parse the data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':false}));

//This call allow us to call from the html all the information in public
app.use(express.static(__dirname +'/public'));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({ secret: 'K1ng15#@C71u5ioZ', resave: false, saveUninitialized: false 	}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/', api);

app.listen(3000, function(){
	console.log('Listening to PORT 3000');
});