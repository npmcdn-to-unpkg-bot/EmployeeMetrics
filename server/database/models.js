'use strict'

var mongoose 	= 	require('mongoose');
var moment 		=  	require('moment')
var ObjectId 	= 	mongoose.Types.ObjectId;

var passport 	=	require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Employee 	= 	require('../models/employee');
var Category 	= 	require('../models/category');
var EmployeeCategory = require('../models/employeecategory');
var EmployeeManager = require('../models/employeeManager');



var passconfig = require('../config/passconfig');
var key = passconfig.key;


passport.use('login',new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password'
	},
	function(username, password,done){
		
		Employee.findOne({'email': username}, function(err,data){
			if(err){
				return done(err);
			}else{
				if(!data){ 	return done(null, false, {	message: 'Incorrect username'});	}
				if (password != passconfig.decrypt(data.password,key)){	return done(null, false, {message: 'Incorrect password'}); 	}	
				return done(null,data);
			}
		});
			
	}

));

passport.serializeUser(function(user,done){
	done(null,user);
});

passport.deserializeUser(function(user, done){
	done(null, user);
});



//this function find all employees regardless their access level
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


//finds all employees with access level 0
var findEmployeesOnly = function(req,res){
	
	Employee.find({'accesslevel': 0, 'active' : true}, function(err,data){
		if (err){
			response = {'error': true, 'message': 'error fetching data from employees'};
			res.json(response);
		}else{
			
			res.json(data);
		
		}
	});
}

//Finds all categoreis in for the training matrix
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
req.logout();
	});
}

//finds all categories for the technology matrix
var findCategories = function(req,res){
	var response = {};
	//Query all the categories in the Category collection
	Category.find({'table' : req.query.table}, function(err,data){
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

//finds all categories for the technology matrix
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

//finds all categories for the continuous evaluarion matrix
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

//depending of the user calling this function it shows the 
//the relation between employees and the matrix requested
//it takse into consideration date, and user
var findEmployeesCategoriesMatrix = function(req, res){
	var response = {};	
	var managerId = null;
	//gets token from the query
	
	if (req.query.employeeId == undefined){

		req.query.employeeId = req.user._id;
	}

	
	
	//compares the employeeId requested with the user asking for this employee
	if(req.query.employeeId.toString() == req.user._id.toString()){
		//if it is the user sets managerId to null
		managerId = null;
	}else{
		//if it is the manager sets the manager id with the token._id information
		managerId = req.user._id;
	}

	
	//gets the date from the query
	var startDate  = moment(req.query.date);
	//set date to 1
	startDate.date(1);
	
	
	//setrs the end date to compare on the query
	var endDate = moment(startDate).add(1,'months');

	
		
	//Find all the documents in EmployeeCategory which employeeId is equal the the id pass through url
	EmployeeCategory.find({	'employeeId' : req.query.employeeId, 
									'table': parseInt(req.query.table),
									'managerId': managerId,
									'date': {$gte: new Date(startDate._d).toISOString(), $lt: new Date(endDate._d).toISOString()}}, 
									function(err,data){
		if (err){
			//If an error happens it sends information about the error to the client
			response = {'error': true, 'message': 'error fetching data from Employees Categories on employeeId: ' + req.query.employeeId};
			res.json(response);
		}else
		{
			//Sends to the client the deata retrieved
			res.json(data);
			
		}
	});
}

//This function updates the information in the matrix being watched
var updateTrainingMatrix = function(req, res){
	var response={};

	//Creates new employeeCategory for validation on the server side
	var db = new EmployeeCategory();

	//compares the employeeId requested with the user asking for this employee
	if(req.user._id.toString() == req.body.employeeId.toString()){
		//if it is the user sets managerId to null
		db.managerId = null;
	}else{
		//if it is the manager sets the manager id with the token._id information
		db.managerId = req.user._id;
	}

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
				'managerId'	 : db.managerId,
				'categoryId' : db.categoryId, 
				'date' 		 : {	//compare greater equal than start date and less than end date
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
	
	
	
	//compares the employeeId requested with the user asking for this employee
	if(req.user._id.toString() == req.body.employeeId.toString()){
		//if it is the user sets managerId to null
		db.managerId = null;
	}else{
		//if it is the manager sets the manager id with the token._id information
		db.managerId = req.user._id;
	}

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


//this function finds an specific employee
var findEmployee = function(req,res){
	var response ={};
	
	//assign to id either the requested id or employeeId
	var id = req.query.id || req.query.employeeId;

	//gets the token from the query
	
	
	//if there is no token
	if(id){
		//look for the id using the id variable
		Employee.find({'_id': id}, function(err,data){
			if (err){
				//If an error happens it sends information about the error to the client
				response = {'error': true, 'message': 'error fetching the employee ' + req.query.id};
				res.json(response);
			}else
			{
				//Sends to the client the deata retrieved
				res.json(data);
			}
		})
	}else{
		var data = req.user;
		delete data.password;
		
		
		res.send(data);

	}
	
}

//this function is to create a new employee
var createEmployee = function(req,res){
	var response = {};
	//creates a new employee Schema
	var db = new Employee();
	//Assings all the information to the model
	db._id = mongoose.Types.ObjectId();
	db.firstname = req.body.firstname;
	db.lastname = req.body.lastname;
	db.email = req.body.email;
	//this value is encrypted using the function encrypt defined above
	db.password = passconfig.encrypt(req.body.password, key);

	db.accesslevel = parseInt(req.body.accesslevel);
	db.active = req.body.active;
	
	//saves the employee in the database
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

//this function updates information about the employee
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

//this function authenticates the user in login
var authenticate = function(req,res){
	var response={};
	var db = req.body;
	

	db.password = req.body.password;
	
	//find the first employee with the e-mail entered passed by the request
	Employee.findOne({'email': req.body.email},function(err, data){
		if(err){
			response = {'error': true, 'message' : 'Something really bad happened'};
			res.send(response);
		}else{
			if(data == null){
				response = {'error': true, 'message': 'User and password not valid'}
				res.send(response);
			}else{
				//decrypts the password to see if are equal
				if (passconfig.decrypt(data.password,key) == db.password){
					//if equal sends data

					//creates the object that it is going to contain all the information
					//of our token
					var sendData = {};
					//sers information
					sendData._id	= data._id;
					sendData.firstname = data.firstname;
					sendData.accesslevel = data.accesslevel;
					sendData.lastname = data.lastname;
					sendData.email = data.email;
					//creates token encrypting it using the key mentioned above
					//token = jwt.sign(sendData, key, {expiresIn :'4h'});
					response = {'error': false, 'message': 'changes made successfully'};
					res.send(response);
				}else{
					response = {'error': true, 'message' : 'User and password not valid'};
					res.send(response);
				}
			}
		}
		
	});
}


//this function helps to send the accesslevel of the user from the token
var getaccess = function(req,res){
	
	res.send({'access': req.user.accesslevel});
}

//find all managers that are active
var findManagers = function(req,res){
	Employee.find({'accesslevel': 1, 'active': true}, function(err,data){
		if (err){
			response = {'error': true, 'message': 'error fetching data from employees'};
			res.json(response);
		}else{
			res.json(data);
		
		}
	});
}

//finds employees that are under the manager sent through the request
var findEmployeesUnderManager = function(req,res){

	var managerId = req.user._id;
	if(req.query.id)
	{
		managerId = req.query.id;
	}
	
	EmployeeManager.find({'managerId' : managerId, 'status' : true}, function(err,data){
		if (err){
			response = {'error': true, 'message': 'error fetching data from employees'};
			res.json(response);
		}else{
			res.json(data);
		}
	});
}


//Look for all employees that not have a manager assign
var findEmployeesWithNoManager = function(req,res){
	var employees = {};
	var employeeManager = {};
	var employeesAux = {};
	EmployeeManager.find({'status':true}).sort({'employeeId' : 'ascending'}).exec(function(err,data){
		if (err){
			response = {'error': true, 'message': 'error fetching data from employees'};
			res.json(response);
		}else{
			employeeManager = data;
			
			Employee.find({'accesslevel': {$lt:2} , 'active' : true}, function(err,data){
				if (err){
					response = {'error': true, 'message': 'error fetching data from employees'};
					res.json(response);
				}else{
					employees = data;
					employeesAux = data;
					for (var i = 0 ; i < employees.length;i++){
						for (var j = 0; j < employeeManager.length; j++){
							
							
							if (employees[i]._id.toString() == employeeManager[j].employeeId.toString()){
								
								employeesAux.splice(i,1);
								
							}
						}
					}
					
					res.json(employeesAux);
					
				}
			});
		}
	});
	
}

//Adds employee to the designed manager
var addEmployeeToManager = function(req,res){
	
	var response = {};
	var db = new EmployeeManager();
	db._id = mongoose.Types.ObjectId();
	db.employeeId = req.body.employeeId;
	db.managerId = req.body.managerId;
	
	db.status = true;
	if (db.employeeId.toString() != db.managerId.toString()){
		db.save(function(err){
		//if an error is or not saves a different response and sends it to the client
			if (err){
				response = {'error': true, 'message' : 'Something really bad happened'};
			}else
			{
				response = {'error': false, 'message' : 'Data added'};
			}
		});
	}else{
		response = {'error': true, 'message' : 'the employee cannot be its own manager'};
		
	}
	res.send(response);

}

//Removes relation manager employee
var setToInactive = function(req,res){
	var response = {};
	var db = req.query;
	
	EmployeeManager.remove({'employeeId': db.employeeId, 'managerId': db.managerId}, function(err, data){
		if (err){
			response = {'error': true, 'message' : 'Something really bad happened'};
			console.log(response);
		}else
		{
			response = {'error': false, 'message' : 'Data modified'};
			console.log(response);
			
		}
	});
	res.send(response);
}

var findEmployeesCategoresFromManager = function(req,res){
	var response = {};	
	
	var id = null;
	
	var startDate = moment(req.query.date);
	
	var endDate = moment(startDate).add(1, 'month');
	
	
	//gets token from the query
	if (req.query._id){
		id = req.query._id;
	}else{
		
		id = req.user._id
	}
	

	//if the person loged is manager
	EmployeeManager.findOne(
		{
			'employeeId' : id,
			'status': true
		},
		function(err,data){
			if(err){
				response = {'error': true, 'message' : 'Something really bad happened'};
				res.json(response);
			}else{
				//If there is no data
				if (data == null){
					response = null;
					res.send(response);
				}else{
					var managerId = data.managerId;

					//Find all the documents in EmployeeCategory which employeeId is equal the the id pass through url
					EmployeeCategory.find({	'employeeId' : id, 
													'table': parseInt(req.query.table),
													'managerId': managerId,
													'date': {$gte: new Date(startDate._d).toISOString(), $lt: new Date(endDate._d).toISOString()}}, 
													function(err,data){
						if (err){
							//If an error happens it sends information about the error to the client
							response = {'error': true, 'message': 'error fetching data from Employees Categories on employeeId: ' + req.query.employeeId};
							res.json(response);
						}else
						{
							//Sends to the client the data retrieved
							
							res.json(data);
						}
				});
			}
		}
	});
}

var findEmployeesCategoresFromEmployee = function(req,res){
	var response = {};	
	
	var id = null;
	
	var startDate = moment(req.query.date);
	
	var endDate = moment(startDate).add(1, 'month');
	
	//gets token from the query
	
	if (req.query._id){
		id = req.query._id;
	}else{
		
		id = req.user._id
	}


		//Find all the documents in EmployeeCategory which employeeId is equal the the id pass through url
		EmployeeCategory.find({	'employeeId' : id, 
										'table': parseInt(req.query.table),
										'managerId': null,
										'date': {$gte: new Date(startDate._d).toISOString(), $lt: new Date(endDate._d).toISOString()}}, 
										function(err,data){
			if (err){
				//If an error happens it sends information about the error to the client
				response = {'error': true, 'message': 'error fetching data from Employees Categories on employeeId: ' + req.query.employeeId};
				res.json(response);
			}else
			{
				//Sends to the client the deata retrieved
				res.json(data);
				
			}
		
	});
}

var changePassword = function(req,res){
	var response = {};
	var db = req.body;

	if(!req.body._id)
	{
		console.log('entered');
		db._id = req.user._id;	
	}

	Employee.findOne({'_id': db._id}, function(err, user){
		if(err){
			response = {'error': true, 'message' : 'Something really bad happened'};
			res.json(response);
		}else{
			
			
			
			if(passconfig.decrypt(user.password,key) == db.oldPassword){ 
				
				Employee.update({'_id' : user.id},{$set:{password : passconfig.encrypt(db.newPassword,key)}}, function(err, data){
					if(err){
						response = {'error': true,'message': 'no user found'};
						res.json(response);
					}else{
						response = {'error': false,'message': 'Password changed'};
						res.json(response);
				
					}
				});
				
			}else{
				response = {'error' : true, 'message': 'old password not match'};	
				res.json(response);
			}
		}
	});
}



//Exports all schemas created
module.exports.model = {

	//Exporting functionalities needed
	
	findEmployees : findEmployees,
	findEmployeesOnly : findEmployeesOnly,
	//Finding categories for the different tables
	findCategoriesContinuousEvaluationMatrix : findCategoriesContinuousEvaluationMatrix,
	findCategoriesTechnologyMatrix : findCategoriesTechnologyMatrix,
	findCategoriesTrainingMatrix : findCategoriesTrainingMatrix,

	//Finding relations between employees and categories for the three tables
	findEmployeesCategoriesMatrix : findEmployeesCategoriesMatrix,
	findEmployeesCategoresFromManager : findEmployeesCategoresFromManager,
	findEmployeesCategoresFromEmployee : findEmployeesCategoresFromEmployee,
	
	updateTrainingMatrix 	: updateTrainingMatrix,
	addScoreTrainingMatrix 	: addScoreTrainingMatrix,
	findEmployee 			: findEmployee,
	createEmployee			: createEmployee,
	updateEmployee			: updateEmployee,
	authenticate 			: authenticate,
	getaccess				: getaccess,
	findManagers			: findManagers,
	findEmployeesUnderManager	: findEmployeesUnderManager,
	findEmployeesWithNoManager	: findEmployeesWithNoManager,
	addEmployeeToManager 	: addEmployeeToManager,
	setToInactive  			: setToInactive,
	changePassword 			: changePassword,
	findCategories 			: findCategories
};