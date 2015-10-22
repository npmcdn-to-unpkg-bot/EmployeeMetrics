var express = require('express');
var fs = require('fs');
var path = require('path');


//This connects to the MongoDB database
var db = require('mongoskin').db('mongodb://localhost:27017/people');
//This get the function for object Id for the Ids in the different collections
ObjectID = require('mongoskin').ObjectID;


var app = express();

//set a public file to be avalible for the html to be read
app.use(express.static(__dirname +'/public'));

//Loads index.html
app.get('/', function(req, res){

	res.sendFile(path.join(__dirname,"./index.html"));

});

//Get categories collection from mongo db using find
app.get('/getcategories', function(req, res){
	console.log('getting categories');
	//this line finds the data in the database
	db.collection('categories').find().toArray(function(err, result){
		if (err) throw err;
		res.send(result);
	})
});

//Get people collection from mongo db using find
app.get('/getpeople', function(req, res){
	console.log('getting people');
	//this line finds the data in the database
	db.collection('employees').find().toArray(function(err, result){
		if (err) throw err;
		res.send(result)
	});
});

//Get people categories collection with the id passed as parameter from mongo db using find
app.get('/getcategoriespeople', function(req, res){
	console.log('getting people categories');
	//Get the parameter
	var id = req.param('employeeId');
	//this line finds the data in the database
	db.collection('employees.categories').find({'employeeId': new ObjectID(id)}).toArray(function(err, result){
		if(err) throw err;
		res.send(result);
	});
});



app.listen(3000);