var mongoose 	= 	require('mongoose');
var db			=	require('./models');
var ObjectId 	= 	mongoose.Types.ObjectId;

var dbCalls = {};

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


dbCalls.findEmployeesCategoriesFromEmployee = function(req,res){
	db.model.findEmployeesCategoriesFromEmployee(req,res);
}

dbCalls.changePassword = function(req,res){
	db.model.changePassword(req,res);
}
dbCalls.findCategories = function(req,res){
	db.model.findCategories(req,res);
};

dbCalls.findCategory = function(req,res){
	db.model.findCategory(req,res);
};

dbCalls.createCategory = function(req,res){
	db.model.createCategory(req,res);
};
dbCalls.updateCategory = function(req,res){
	db.model.updateCategory(req,res);
};


dbCalls.findAspects = function(req,res){
	db.model.findAspects(req,res);
};

dbCalls.findAspect  = function(req,res){
	db.model.findAspect(req,res);
};

dbCalls.createAspect  = function(req,res){
	db.model.createAspect(req,res);
};

dbCalls.updateAspect  = function(req,res){
	db.model.updateAspect(req,res);
};

dbCalls.findTables = function(req,res){
	db.model.findTables(req,res);
}
dbCalls.findTable = function(req,res){
	db.model.findTable(req,res);
}
dbCalls.createTable = function(req,res){
	db.model.createTable(req,res);
}
dbCalls.updateTable = function(req,res){
	db.model.updateTable(req,res);
}

dbCalls.findGroups = function(req,res){
	db.model.findGroups(req, res);
};
dbCalls.findGroup = function(req,res){
	db.model.findGroup(req, res);
};
dbCalls.createGroup = function(req,res){
	db.model.createGroup(req, res);
};
dbCalls.updateGroup = function(req,res){
	db.model.updateGroup(req, res);
};


module.exports = dbCalls;