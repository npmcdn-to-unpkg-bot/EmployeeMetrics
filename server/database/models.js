var mongoose 	= 	require('mongoose');
var moment 		=  	require('moment')
var ObjectId 	= 	mongoose.Types.ObjectId;
var crypto 		= 	require('crypto');

var key = 'c0n.3E,!;36Rde|0m0Nos.20.yE.15';


function encrypt(data,key){
	var cipher = crypto.createCipher('aes256', key);
	var crypted = cipher.update(data, 'utf-8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}

function decrypt(data,key){
	var decipher = crypto.createDecipher('aes256', key);
    var decrypted = decipher.update(data, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}


//Connects to the database people in mongoDB
mongoose.connect('mongodb://localhost:27017/people');

//Saves the schema object into mongoSchema
var mongoSchema = mongoose.Schema;

//Creates employee Schema
var employeeSchema = new mongoSchema({
	'_id'			: mongoSchema.ObjectId,
	'firstname'		: String,
	'lastname'		: String,
	'email'			: String,
	'password'		: String,
	'accesslevel'	: Number,
	'active'		: Boolean
});

//Creates employee from employeeSchema
var Employee = mongoose.model('Employee', employeeSchema);

//Creates categorySchema
var categorySchema = new mongoSchema({
	'_id'	: 	mongoSchema.ObjectId,
	'name'	: 	String,
	'table'	: 	Number
});

//Creates category from CategorySchema
var Category = mongoose.model('Category', categorySchema);

//Creates employee caetegory schema
var employeeCategorySchema = new mongoSchema({
	'_id'			: 	mongoSchema.ObjectId,
	'employeeId'	: 	{type: mongoSchema.ObjectId, ref: 'Employee'},
	'categoryId'	: 	{type: mongoSchema.ObjectId, ref: 'Category'},
	'date'			: 	Date,
	'table'			: 	Number,
	'Results'		: 	[
			Number, 
			Number, 
			Number, 
			Number	
		]
});

//Creates employeeCategory from employeeCategorySchema
var EmployeeCategory = mongoose.model('employees.categories', employeeCategorySchema);


var findEmployees = function(req,res)
{
	Employee.find({}, function(err,data){
		if (err){
			response = {'error': true, 'message': 'error fetching data from employees'};
			res.json(response);
		}else{
			res.json(data);
		
		}
	});

}


var findCategoriesTrainingMatrix = function(req,res){
	
	var response = {};
	//Query all the categories in the Category collection
	Category.find({'table' : 1}, function(err,data){
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

var findCategoriesTechnologyMatrix = function(req,res){
	
	var response = {};
	//Query all the categories in the Category collection
	Category.find({'table' : 0}, function(err,data){
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

var findCategoriesContinuousEvaluationMatrix = function(req,res){
	
	var response = {};
	//Query all the categories in the Category collection
	Category.find({'table' : 2}, function(err,data){
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

var findEmployeesCategoriesMatrix = function(req, res){
	var response = {};	
	

	var startDate  = moment(req.query.date);
	startDate.date(1);
	
	var endDate = moment(startDate).add(1,'months');
		
	//Find all the documents in EmployeeCategory which employeeId is equal the the id pass through url
	EmployeeCategory.find({	'employeeId' : req.query.employeeId, 
									'table': parseInt(req.query.table),
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
	db.table = parseInt(req.body.table);
	var startDate  = moment(req.body.date);
	startDate.date(1);
	var endDate = moment(startDate).add(1,'months');
	//Update the old information with the new one 
	EmployeeCategory.update(
			{
				'employeeId' : db.employeeId, 
				'categoryId' : db.categoryId, 
				'date' 		 : {	
									$gte: new Date(startDate._d).toISOString(), 
									$lt: new Date(endDate._d).toISOString()
								}
			}, //Query where to update
			{
				$set: 
				{
					'Results' : db.Results, 
					'employeeIdId': db.employeeId , 
					'categoryId': db.categoryId, 
					'date': db.date, 
					'table' : db.table
				}
			}, //Values to change
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
	db.table = parseInt(req.body.table);
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

var findEmployee = function(req,res){
	var response ={}
	var id = req.params.id;
	
	//console.log(req.params);
	Employee.find({'_id': id}, function(err,data){
		if (err){
			//If an error happens it sends information about the error to the client
			response = {'error': true, 'message': 'error fetching the employee ' + req.params.id};
			res.json(response);
		}else
		{
			//Sends to the client the deata retrieved
			res.json(data);
		}
	})
	
}

var createEmployee = function(req,res){
	var response = {};
	var db = new Employee();
	db._id = mongoose.Types.ObjectId();
	db.firstname = req.body.firstname;
	db.lastname = req.body.lastname;
	db.email = req.body.email;
	db.password = encrypt(req.body.password, key);
	db.accesslevel = parseInt(req.body.accesslevel);
	db.active = req.body.active;
	
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

var updateEmployee = function(req,res){
	var response = {};
	var db = req.body;
	Employee.update({'_id' : db._id},
					{
						$set: 
						{
							'firstname' 	: db.firstname,
							'lastaname'		: db.lastaname,
							'accesslevel'	: db.accesslevel,
							'email'			: db.email,
							'active'		: db.active,
							'password'		: db.password
						}
					},function(err,data){
						//If an error appear or not it set response and send a message to the client
						if(err){
							response = {'error': true, 'message' : 'Something really bad happened'};
						}else{
							response = {'error': false, 'message' : 'Data added'};
						}

						res.send(response);
					});
}

//Exports all schemas created
module.exports.model = {
	//Exporting schemas models
	Employee : Employee,
	Category : Category,
	EmployeeCategory : EmployeeCategory,

	//Exporting functionalities needed
	
	findEmployees : findEmployees,
	
	//Finding categories for the different tables
	findCategoriesContinuousEvaluationMatrix : findCategoriesContinuousEvaluationMatrix,
	findCategoriesTechnologyMatrix : findCategoriesTechnologyMatrix,
	findCategoriesTrainingMatrix : findCategoriesTrainingMatrix,

	//Finding relations between employees and categories for the three tables
	findEmployeesCategoriesMatrix : findEmployeesCategoriesMatrix,
	
	updateTrainingMatrix 	: updateTrainingMatrix,
	addScoreTrainingMatrix 	: addScoreTrainingMatrix,
	findEmployee 			: findEmployee,
	createEmployee			: createEmployee,
	updateEmployee			: updateEmployee
};