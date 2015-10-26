var mongoose = require('mongoose');
var moment 		=  	require('moment')
var ObjectId 	= 	mongoose.Types.ObjectId;

//Connects to the database people in mongoDB
mongoose.connect('mongodb://localhost:27017/people');

//Saves the schema object into mongoSchema
var mongoSchema = mongoose.Schema;

//Creates employee Schema
var employeeSchema = new mongoSchema({
	'_id'		: mongoSchema.ObjectId,
	'firstname'	: String,
	'lastname'	: String,
	'index'		: Number
});

//Creates employee from employeeSchema
var Employee = mongoose.model('Employee', employeeSchema);

//Creates categorySchema
var categorySchema = new mongoSchema({
	'_id'	: 	mongoSchema.ObjectId,
	'name'	: 	String
});

//Creates category from CategorySchema
var Category = mongoose.model('Category', categorySchema);

//Creates employee caetegory schema
var employeeCategorySchema = new mongoSchema({
	'_id'			: 	mongoSchema.ObjectId,
	'employeeId'	: 	{type: mongoSchema.ObjectId, ref: 'Employee'},
	'categoryId'	: 	{type: mongoSchema.ObjectId, ref: 'Category'},
	'date'			: 	Date,
	'Results'		: 	[
			Number, 
			Number, 
			Number, 
			Number	
		]
});

//Creates employeeCategory from employeeCategorySchema
var EmployeeCategory = mongoose.model('employees.categories', employeeCategorySchema);



var findEmployeesTrainingMatrix = function(req,res){
	var response = {};
	//This function find all Documents inside Employee collection
	Employee.find({}, function(err,data){
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
}

var findCategoriesTrainingMatrix = function(req,res){
	
	var response = {};
	//Query all the categories in the Category collection
	Category.find({}, function(err,data){
		if (err){
			//Sends Error if the query is unsuccessful
			response = {'error': true, 'message': 'error fetching data from categries'};
			res.json(data);
		}else{
			//Sends to the client the deata retrieved
			res.json(data);
		}

	});
}

var findEmployeeTrainingMatrix = function(req, res){
	var response = {};	

	var startDate  = moment(req.query.date);
	startDate.date(1);
	
	var endDate = moment(startDate).add(1,'months');
		
	//Find all the documents in EmployeeCategory which employeeId is equal the the id pass through url
	EmployeeCategory.find({	'employeeId' : ObjectId.createFromHexString(req.params.id), 
									'date': {$gte: new Date(startDate._d).toISOString(), $lt: new Date(endDate._d).toISOString()}}, 
									function(err,data){
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
}

var updateTrainingMatrix = function(req, res){
	var response={};
	var db = new EmployeeCategory();
	//Sets new information to be saved
	db.employeeId = req.body.employeeId
	db.categoryId = req.body.categoryId;
	db.Results = req.body.Results;
	db.date = req.body.date;
	
	var startDate  = moment(req.body.date);
	startDate.date(1);
	var endDate = moment(startDate).add(1,'months');
	//Update the old information with the new one 
	EmployeeCategory.update(
		{'employeeId' : db.employeeId, 'categoryId' : db.categoryId, 'date':{$gte: new Date(startDate._d).toISOString(), $lt: new Date(endDate._d).toISOString()}}, //Query where to update
		{$set: {'Results' : db.Results, 'employeeIdId': db.employeeId , 'categoryId': db.categoryId, 'date': db.date}}, //sValues to change
		function(err,data){
			//If an error appear or not it set response and send a message to the client
			if(err){
				response = {'error': true, 'message' : 'Something really bad happened'};
			}else{
				response = {'error': false, 'message' : 'Data added'};
			}
			res.send(response);
	});
}

var addScoreTrainingMatrix = function(req,res){
	var response={};
	//creates a new document for EmployeeCategory
	var db = new EmployeeCategory();
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
}

//Exports all schemas created
module.exports.model = {
	//Exporting schemas models
	Employee : Employee,
	Category : Category,
	EmployeeCategory : EmployeeCategory,

	//Exporting functionalities needed
	findEmployeesTrainingMatrix : findEmployeesTrainingMatrix,
	findCategoriesTrainingMatrix : findCategoriesTrainingMatrix,
	findEmployeeTrainingMatrix : findEmployeeTrainingMatrix,
	updateTrainingMatrix : updateTrainingMatrix,
	addScoreTrainingMatrix : addScoreTrainingMatrix
};