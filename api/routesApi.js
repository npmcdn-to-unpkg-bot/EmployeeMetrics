var express		=	require ('express');
var app			= 	express();
var path 		= 	require('path');
var mongoose	= 	require('mongoose');
var mongoOp		=	require('../models/mongo');
var moment 		=  	require('moment');
var router		=	express.Router();
var ObjectId 	= 	mongoose.Types.ObjectId;



/*router.get('/trainingmatrix', function(req,res){
	
	res.sendFile(path.join(__dirname,"../public/views/training.matrix.tmpl.html"));
});*/

//Gets index.html whenever we call localhost
router.get('/', function(req,res){
	res.sendFile(path.join(__dirname,"../index.html"));
});




//Routes all the information in categories
router.route('/categories/training')
	.get(function(req, res){
		mongoOp.model.findCategoriesTrainingMatrix(req,res);
	});

router.route('/categories/technology')
	.get(function(req, res){
		mongoOp.model.findCategoriesTechnologyMatrix(req,res);
	});

router.route('/categories/continuous')
	.get(function(req, res){
		mongoOp.model.findCategoriesContinuousEvaluationMatrix(req,res);
	});



//Routes all information in Employees
router.route('/employees')
	//Get Employees data
	.get(function(req, res){
		mongoOp.model.findEmployees(req,res);
	})
	//Post new information in employee categories
	.post(function(req,res){
		mongoOp.model.addScoreTrainingMatrix(req,res);
	});


//Routes to get all results between categories and people
router.route('/employees/:id')
	//Gets information taking id as parameter
	.get(function(req, res){
		mongoOp.model.findEmployeesCategoriesMatrix(req,res);
	})
	//Post informatio taking id as parameter
	.post(function(req, res){
		mongoOp.model.updateTrainingMatrix(req,res);
	});

module.exports = router;