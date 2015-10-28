var mongoose	= 	require('mongoose');
var db			=	require('./models');
var ObjectId 	= 	mongoose.Types.ObjectId;

var dbCalls = {};

dbCalls.findCategoriesTrainingMatrix = function(req,res)
{
	db.model.findCategoriesTrainingMatrix(req,res);
}

dbCalls.findCategoriesTechnologyMatrix = function(req,res){
	db.model.findCategoriesTechnologyMatrix(req,res);
}

dbCalls.findCategoriesContinuousEvaluationMatrix = function(req,res){
	db.model.findCategoriesContinuousEvaluationMatrix(req,res);
}

dbCalls.findEmployees = function(req,res){
	db.model.findEmployees(req,res);
}

dbCalls.addScoreTrainingMatrix = function(req, res){
	db.model.addScoreTrainingMatrix(req,res);
}

dbCalls.findEmployeesCategoriesMatrix = function(req,res){
	db.model.findEmployeesCategoriesMatrix(req,res);
}

dbCalls.updateTrainingMatrix = function(req,res){
	db.model.updateTrainingMatrix(req,res);
}

dbCalls.createEmployee = function(req,res){
	db.model.createEmployee(req,res);
}

dbCalls.findEmployee = function(req,res){
	db.model.findEmployee(req,res);
}
module.exports = dbCalls;