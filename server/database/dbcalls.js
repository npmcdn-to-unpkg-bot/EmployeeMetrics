var mongoose 	= 	require('mongoose');
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

dbCalls.findEmployeesOnly = function(req,res){
	db.model.findEmployeesOnly(req,res);
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

dbCalls.updateEmployee = function(req,res){
	db.model.updateEmployee(req,res);
}

dbCalls.authenticate = function(req,res){
	db.model.authenticate(req,res);
}

dbCalls.validate = function(req,res){
	db.model.validate(req,res);
}

dbCalls.getaccess = function(req,res){
	db.model.getaccess(req,res);
};

dbCalls.findManagers = function(req,res)
{
	db.model.findManagers(req,res);
}

dbCalls.addEmployeeToManager = function(req,res){
	db.model.addEmployeeToManager(req,res);
}

dbCalls.findEmployeesWithNoManager = function(req,res){
	db.model.findEmployeesWithNoManager(req,res);
}

dbCalls.findEmployeesUnderManager = function(req,res){
	db.model.findEmployeesUnderManager(req,res);
}

dbCalls.setToInactive	=	function(req,res){
	db.model.setToInactive(req,res);
}

dbCalls.findEmployeesCategoresFromManager = function(req,res){
	db.model.findEmployeesCategoresFromManager(req,res);
}

dbCalls.findEmployeesCategoresFromEmployee = function(req,res){
	db.model.findEmployeesCategoresFromEmployee(req,res);
}

dbCalls.changePassword = function(req,res){
	db.model.changePassword(req,res);
}
module.exports = dbCalls;