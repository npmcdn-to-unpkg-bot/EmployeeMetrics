var mongoose 	= 	require('mongoose');
var moment 		=  	require('moment')
var ObjectId 	= 	mongoose.Types.ObjectId;
var crypto 		= 	require('crypto');
var expressJwt 	= 	require('express-jwt');
var jwt 		=	require('jsonwebtoken');

//This is the key usde for password and token encryption 
//DO NOT MODIFY
var key = 'c0n.3E,!;36Rde|0m0Nos.20.yE.15';

//this function encrypts the password
function encrypt(data,key){
	var cipher = crypto.createCipher('aes256', key);
	var crypted = cipher.update(data, 'utf-8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}

//this function decrypts the password
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
	'managerId'		: 	{type: mongoSchema.ObjectId, ref: 'Employee'},
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

//creates employee manager schema
var employeeManagerSchema =  new mongoSchema({
	'_id' 			: mongoSchema.ObjectId,
	'employeeId' 	: {type: mongoSchema.ObjectId, ref: 'Employee'},
	'managerId'		: {type: mongoSchema.ObjectId, ref: 'Employee'},
	'status'		: Boolean
});

//creates employee manager from employeeManagerSchema
var EmployeeManager = mongoose.model('employeemanager', employeeManagerSchema);

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
	
	//gets token from the query
	var token = jwt.decode(req.query.token);
	if (req.query.employeeId == undefined){

		req.query.employeeId = token._id;
	}

	
	
	//compares the employeeId requested with the user asking for this employee
	if(req.query.employeeId.toString() == token._id.toString()){
		//if it is the user sets managerId to null
		managerId = null;
	}else{
		//if it is the manager sets the manager id with the token._id information
		managerId = token._id;
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

	//decodes the token got it from the body
	var token = jwt.decode(req.body.token);
	
	//compares the employeeId requested with the user asking for this employee
	if(token._id.toString() == req.body.employeeId.toString()){
		//if it is the user sets managerId to null
		db.managerId = null;
	}else{
		//if it is the manager sets the manager id with the token._id information
		db.managerId = token._id;
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
	
	//decodes the token got it from the body
	var token = jwt.decode(req.body.token);
	
	//compares the employeeId requested with the user asking for this employee
	if(token._id.toString() == req.body.employeeId.toString()){
		//if it is the user sets managerId to null
		db.managerId = null;
	}else{
		//if it is the manager sets the manager id with the token._id information
		db.managerId = token._id;
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
	var token = req.query.token;
	
	//if there is no token
	if(!token){
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
		//decode token
		var token = jwt.decode(req.query.token);
		
		//look for the employee using the id in the token
		Employee.find({'_id': token._id}, function(err, data){
			if (err){
				//If an error happens it sends information about the error to the client
				response = {'error': true, 'message': 'error fetching the employee ' + token._id};
				res.json(response);
			}else
			{
				//Sends to the client the deata retrieved
				res.json(data);
			}
		});
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
	db.password = encrypt(req.body.password, key);

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
	var token = {};

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
				if (decrypt(data.password,key) == db.password){
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
					token = jwt.sign(sendData, key, {expiresIn :'4h'});
					response = {'error': false, 'message': token};
					res.send(response);
				}else{
					response = {'error': true, 'message' : 'User and password not valid'};
					res.send(response);
				}
			}
		}
		
	});
}


//this function validates if the token was tampered
var validate = function(req,res){
	
	var token = req.body.token;
	//this fuction compares the two tokens 
	jwt.verify(token,key,function(err, decoded){
		if(err){
			res.send(false);
		}
		else{
			res.send(true);
		};

	});	

}

//this function helps to send the accesslevel of the user from the token
var getaccess = function(req,res){
	var decode = jwt.decode(req.query.token);
	res.send(decode.accesslevel.toString());
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
	var managerId = req.query.id;
	var token = req.query.token;
	
	if (token){
		var token = jwt.decode(req.query.token);
		managerId = token._id;
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

//set status to false... CHANGE TO REMOVE
var setToInactive = function(req,res){
	var response = {};
	var db = req.body;
	
	EmployeeManager.remove({'employeeId': db.employeeId, 'managerId': db.managerId}, function(err, data){
		if (err){
			response = {'error': true, 'message' : 'Something really bad happened'};
			
		}else
		{
			response = {'error': false, 'message' : 'Data modified'};
			
		}
	});
	res.send(response);
}

var findEmployeesCategoresFromManager = function(req,res){
	var response = {};	
	var token = {};
	var id = null;
	
	var startDate = moment(req.query.date);
	
	var endDate = moment(startDate).add(1, 'month');
	
	
	//gets token from the query
	
	if (req.query._id){
		id = req.query._id;
	}else{
		token = jwt.decode(req.query.token);
		id = token._id
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
	var token = {};
	var id = null;
	
	var startDate = moment(req.query.date);
	
	var endDate = moment(startDate).add(1, 'month');
	
	//gets token from the query
	
	if (req.query._id){
		id = req.query._id;
	}else{
		token = jwt.decode(req.query.token);
		id = token._id
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
	var token = req.body.token;

	if(token){
		db.id = jwt.decode(token)._id;
		
	}

	Employee.findOne({'_id': db.id}, function(err, user){
		if(err){
			response = {'error': true, 'message' : 'Something really bad happened'};
			res.json(response);
		}else{
			
			
			
			if(decrypt(user.password,key) == db.oldPassword){ 
				
				Employee.update({'_id' : user.id, 'password': encrypt(db.oldPassword,key)},{$set:{password : encrypt(db.newPassword,key)}}, function(err, data){
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
	//Exporting schemas models
	Employee : Employee,
	Category : Category,
	EmployeeCategory : EmployeeCategory,
	EmployeeManager : EmployeeManager,

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
	validate				: validate,
	getaccess				: getaccess,
	findManagers			: findManagers,
	findEmployeesUnderManager	: findEmployeesUnderManager,
	findEmployeesWithNoManager	: findEmployeesWithNoManager,
	addEmployeeToManager 	: addEmployeeToManager,
	setToInactive  			: setToInactive,
	changePassword 			: changePassword
};