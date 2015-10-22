//All libraries I will use
var express		=	require ('express');
var app			= 	express();
var path 		= 	require('path');
var mongoose	= 	require('mongoose');
var bodyParser	=	require('body-parser');
var mongoOp		=	require('./models/mongo');
var router		=	express.Router();
var ObjectId 	= 	mongoose.Types.ObjectId;


//Use JSON to parse the data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':false}));

//This call allow us to call from the html all the information in public
app.use(express.static(__dirname +'/public'));

//Gets index.html whenever we call localhost
router.get('/', function(req,res){
	res.sendFile(path.join(__dirname,"./index.html"));
});

//Routes all the information in categories
router.route('/categories')
		.get(function(req, res){
			var response = {};
			//Query all the categories in the Category collection
			mongoOp.Category.find({}, function(err,data){
				if (err){
					//Sends Error if the query is unsuccessful
					response = {'error': true, 'message': 'error fetching data from categries'};
					res.json(data);
				}else{
					//Sends to the client the deata retrieved
					res.json(data);
				}

			});
		});

//Routes all information in Employees
router.route('/employees')
		//Get Employees data
		.get(function(req, res){
			var response = {};
			//This function find all Documents inside Employee collection
			mongoOp.Employee.find({}, function(err,data){
				if(err){
					//Response send an error if the query fails
					response = {"error" : true, 'message': "Error Fetching data from employees"};
					//Sends information abour the error
					res.json(response);
				}else{
					//Sends the data found to the client
					res.json(data);
				}
			});
		})
		//Post new information in employee categories
		.post(function(req,res){
			var response={};
			//creates a new document for EmployeeCategory
			var db = new mongoOp.EmployeeCategory();
			//Saves all new information to be saved
			db._id = mongoose.Types.ObjectId();		//Generates ObjectId
			db.employeeId = req.body.employeeId;
			db.categoryId = req.body.categoryId;
			db.Results = req.body.Results;
			db.date = req.body.date;
			//Calss the save functiont to mongo
			db.save(function(err){
				//if an error is or not saves a different response and sends it to the client
				if (err){
					response = {'error': true, 'message' : 'Something really bad happened'};
				}else
				{
					response = {'error': false, 'message' : 'Data added'};
				}
			});
			
			res.send(response);
		});


//Routes to get all results between categories and people
router.route('/employees/:id')
		//Gets information taking id as parameter
		.get(function(req, res){
			var response = {};
			//Find all the documents in EmployeeCategory which employeeId is equal the the id pass through url
			mongoOp.EmployeeCategory.find({'employeeId' : ObjectId.createFromHexString(req.params.id)}, function(err,data){
				if (err){
					//If an error happens it sends information about the error to the client
					response = {'error': true, 'message': 'error fetching data from Employees Categories on employeeId: ' + req.params.id};
					res.json(response);
				}else
				{
					//Sends to the client the deata retrieved
					res.json(data);
				}
			});
		})
		//Post informatio taking id as parameter
		.post(function(req, res){
			var response={};
			var db = new mongoOp.EmployeeCategory();
			//Sets new information to be saved
			db.employeeId = req.body.employeeId
			db.categoryId = req.body.categoryId;
			db.Results = req.body.Results;
			db.date = req.body.date;
			//Update the old information with the new one 
			mongoOp.EmployeeCategory.update(
				{'employeeId' : db.employeeId, 'categoryId' : db.categoryId}, //Query where to update
				{$set: {'Results' : db.Results, 'employeeIdId': db.employeeId , 'categoryId': db.categoryId, 'date':db.date }}, //sValues to change
				function(err,data){
					//If an error appear or not it set response and send a message to the client
					if(err){
						response = {'error': true, 'message' : 'Something really bad happened'};
					}else{
						response = {'error': false, 'message' : 'Data added'};
					}
					res.send(response);
			});
		});


app.use('/', router);
app.listen(3000);
console.log('Listening to PORT 3000');