'use strict'
var express		=	require ('express');
var app			= 	express();
var path 		= 	require('path');
var moment 		=  	require('moment');
var router		=	express.Router();
var dbCalls		=	require('./database/dbcalls');

//REDEFINE ALL THIS
module.exports = function(app, passport){

	//this function check if an user was logged in
	function loggedIn(req,res,next){
		//NOTE: Once the user is logged in information about the user is stored in req.user
		if (req.user){
			//go to next task
			next();
		}else{
			//send status 401 (unauthorized)	
			res.sendStatus(401);
		}
	}

	//Gets index.html whenever we call localhost
	app.get('/', function(req,res){
		res.sendFile(path.join(__dirname,"../index.html"));
	});


	app.route('/authenticate')
		.post(passport.authenticate('login'), function(req,res){
			dbCalls.authenticate(req,res);
		});


	app.route('/getaccess')
		.get(loggedIn, function(req,res){
			dbCalls.getaccess(req,res);
		});


	//Routes all the information in categories
	app.route('/categories/training')
		.get(loggedIn,function(req, res){
			dbCalls.findCategoriesTrainingMatrix(req,res);
		});

	app.route('/categories/technology')
		.get(loggedIn,function(req, res){
			dbCalls.findCategoriesTechnologyMatrix(req,res);
		});

	app.route('/categories/continuous')
		.get(loggedIn,function(req, res){
			dbCalls.findCategoriesContinuousEvaluationMatrix(req,res);
		});


	app.route('/matrix')
		.get(loggedIn,function(req,res){
			dbCalls.findEmployees(req,res);
		})
		.post(loggedIn,function(req,res){
			dbCalls.addScoreTrainingMatrix(req,res);
		})
		.put(loggedIn,function(req,res){
			dbCalls.updateTrainingMatrix(req,res);
		});


	//Routes all information in Employees
	app.route('/employees')
		//Get Employees data
		.get(loggedIn, function(req, res){
			dbCalls.findEmployees(req,res);
		})
		//Post new information in employee categories
		.post(loggedIn, function(req,res){
			dbCalls.addScoreTrainingMatrix(req,res);
		});

	app.route('/employeesonly')
		//Get Employees data
		.get(loggedIn, function(req, res){
			dbCalls.findEmployeesOnly(req,res);
		});

	//Routes to get all results between categories and people
	app.route('/employees/:id')
		//Gets information taking id as parameter
		.get(loggedIn, function(req, res){
			dbCalls.findEmployeesCategoriesMatrix(req,res);
		})
		//Post informatio taking id as parameter
		.post(loggedIn, function(req, res){
			dbCalls.updateTrainingMatrix(req,res);
		});

	app.route('/employee')
		.get(loggedIn,function(req,res){
			dbCalls.findEmployee(req,res);
		})
		.post(loggedIn, function(req,res){
			dbCalls.createEmployee(req,res);
		})
		.put(loggedIn, function(req,res){
			dbCalls.updateEmployee(req,res);
		});



	app.route('/manager')
		.get(loggedIn, function(req,res){
			dbCalls.findManagers(req,res);
		})
		.post(loggedIn,function(req,res){
			dbCalls.addEmployeeToManager(req,res);
		})
		.delete(loggedIn, function(req,res){
			dbCalls.setToInactive(req,res);
		});

		
	app.route('/employee-managers')
		.get(loggedIn, function(req,res){
			dbCalls.findEmployeesUnderManager(req,res);
		});

	app.route('/managers-employees')
		.get(loggedIn, function(req,res){
			dbCalls.findEmployeesWithNoManager(req,res);
		})

	app.route('/managerdashboard')
		.get(loggedIn, function(req,res){
			dbCalls.findEmployeesCategoresFromManager(req,res);
		});

	app.route('/userdashboard')
		.get(loggedIn, function(req,res){
			dbCalls.findEmployeesCategoresFromEmployee(req,res);
		});

	app.route('/password')
		.post(loggedIn, function(req,res){
			dbCalls.changePassword(req,res);
		});

	app.route('/logout')
		.post(loggedIn, function(req,res){
			req.logout();
			res.send(200);
		})

}
