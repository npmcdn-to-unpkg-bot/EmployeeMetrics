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

	app.route('/categories')
		.get(loggedIn, function(req,res){
			dbCalls.findCategories(req,res);
		});

	app.route('/category')
		.get(loggedIn, function(req,res){
			dbCalls.findCategory(req,res);
		})
		.post(loggedIn, function(req,res){
			dbCalls.createCategory(req,res);
		})
		.put(loggedIn, function(req,res){
			dbCalls.updateCategory(req,res);
		});

	app.route('/aspects')
		.get(loggedIn, function(req,res){
			dbCalls.findAspects(req,res);
		});

	app.route('/aspect')
		.get(loggedIn, function(req,res){
			dbCalls.findAspect(req,res);
		})
		.post(loggedIn, function(req,res){
			dbCalls.createAspect(req,res);
		})
		.put(loggedIn, function(req,res){
			dbCalls.updateAspect(req,res);
		});

	app.route('/tables')
		.get(loggedIn, function(req,res){
			dbCalls.findTables(req,res);
		});

	app.route('/table')
		.get(loggedIn, function(req,res){
			dbCalls.findTable(req,res);
		})
		.post(loggedIn, function(req,res){
			dbCalls.createTable(req,res);
		})
		.put(loggedIn, function(req,res){
			dbCalls.updateTable(req,res);
		});

	app.route('/groups')
		.get(loggedIn, function(req,res){
			dbCalls.findGroups(req,res);
		});

	app.route('/group')
		.get(loggedIn, function(req,res){
			dbCalls.findGroup(req,res);
		})
		.post(loggedIn, function(req,res){
			dbCalls.createGroup(req,res);
		})
		.put(loggedIn, function(req,res){
			dbCalls.updateGroup(req,res);
		});

	app.route('/matrix')
		.get(loggedIn,function(req,res){
			dbCalls.findEmployeesCategoriesMatrix(req,res);
		})
		.post(loggedIn,function(req,res){
			dbCalls.addScoreTrainingMatrix(req,res);
		})
		.put(loggedIn,function(req,res){
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

	app.route('/employees')
		.get(loggedIn, function(req,res){
			dbCalls.findEmployees(req,res)
		})

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

	app.route('/dashboard')
		.get(loggedIn, function(req,res){
			dbCalls.findEmployeesCategoriesFromEmployee(req,res);
		});

	app.route('/password')
		.post(loggedIn, function(req,res){
			dbCalls.changePassword(req,res);
		});

	app.route('/logout')
		.post(loggedIn, function(req,res){
			req.logout();
			res.sendStatus(200);
		})

}
