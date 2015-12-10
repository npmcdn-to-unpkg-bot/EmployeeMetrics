//All libraries I will use
var express			=	require ('express');
var app				= 	express();
var bodyParser		=	require('body-parser');
var cookieParser 	= 	require('cookie-parser');
var session 		= 	require('express-session');
var morgan 			= 	require('morgan');
var passport 		= 	require('passport');
var dbconf			= 	require('./server/config/dbconfig');
var mongoose 		= 	require('mongoose');
var sass    		= 	require('node-sass');
var sassMiddleware 	=	require('node-sass-middleware')


//Use JSON to parse the data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':false}));

//This call allow us to call from the html all the information in public

mongoose.connect(dbconf.url);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({ secret: 'K1ng15#@C71u5ioZ', resave: false, saveUninitialized: false 	}))
app.use(passport.initialize());
app.use(passport.session());

app.use(
 sassMiddleware({
     src: __dirname + '/public/styles/sass', 
     dest: __dirname + '/public/styles',
     debug: true,       
     outputStyle: 'compressed',
     prefix:  '/styles'
 })
);   


app.use(express.static(__dirname +'/public'));

require('./server/routesApi')(app, passport);

app.listen(3000, function(){
	console.log('Listening to PORT 3000');
});