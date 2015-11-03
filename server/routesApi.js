var express		=	require ('express');
var app			= 	express();
var path 		= 	require('path');
var moment 		=  	require('moment');
var router		=	express.Router();
var dbCalls		=	require('./database/dbcalls');




/*router.get('/trainingmatrix', function(req,res){
	
	res.sendFile(path.join(__dirname,"../public/views/training.matrix.tmpl.html"));
});*/

//Gets index.html whenever we call localhost
router.get('/', function(req,res){
	res.sendFile(path.join(__dirname,"../index.html"));
});


router.route('/authenticate')
	.post(function(req,res){
		dbCalls.authenticate(req,res);
	});

router.route('/validate')
	.post(function(req,res){
		dbCalls.validate(req,res);
	});

router.route('/getaccess')
	.get(function(req,res){
		dbCalls.getaccess(req,res);
	});


//Routes all the information in categories
router.route('/categories/training')
	.get(function(req, res){
		dbCalls.findCategoriesTrainingMatrix(req,res);
	});

router.route('/categories/technology')
	.get(function(req, res){
		dbCalls.findCategoriesTechnologyMatrix(req,res);
	});

router.route('/categories/continuous')
	.get(function(req, res){
		dbCalls.findCategoriesContinuousEvaluationMatrix(req,res);
	});



//Routes all information in Employees
router.route('/employees')
	//Get Employees data
	.get(function(req, res){
		dbCalls.findEmployees(req,res);
	})
	//Post new information in employee categories
	.post(function(req,res){
		dbCalls.addScoreTrainingMatrix(req,res);
	});

router.route('/employeesonly')
	//Get Employees data
	.get(function(req, res){
		dbCalls.findEmployeesOnly(req,res);
	});

//Routes to get all results between categories and people
router.route('/employees/:id')
	//Gets information taking id as parameter
	.get(function(req, res){
		dbCalls.findEmployeesCategoriesMatrix(req,res);
	})
	//Post informatio taking id as parameter
	.post(function(req, res){
		dbCalls.updateTrainingMatrix(req,res);
	});

router.route('/employee')
	.get(function(req,res){
		dbCalls.findEmployee(req,res);
	})
	.post(function(req,res){
		dbCalls.createEmployee(req,res);
	});

router.route('/employee/:id')
	.post(function(req,res){
		dbCalls.updateEmployee(req,res);
	});

router.route('/employee/:token')
	.get(function(req,res){
		dbCalls.findEmployee(req,res);
	});

router.route('/managers')
	.get(function(req,res){
		dbCalls.findManagers(req,res);
	});

router.route('/manager')
	.post(function(req,res){
		dbCalls.addEmployeeToManager(req,res);
	})
router.route('/employee-managers')
	.get(function(req,res){
		dbCalls.findEmployeesUnderManager(req,res);
	});

router.route('/managers-employees')
	.get(function(req,res){
		dbCalls.findEmployeesWithNoManager(req,res);
	})
	.post(function(req,res){
		dbCalls.setToInactive(req,res);
	})

module.exports = router;