var mongoose = require('mongoose');

//Saves the schema object into mongoSchema
var mongoSchema = mongoose.Schema;



//creates employee manager schema
var employeeManagerSchema =  new mongoSchema({
	'_id' 			: mongoSchema.ObjectId,
	'employeeId' 	: {type: mongoSchema.ObjectId, ref: 'Employee'},
	'managerId'		: {type: mongoSchema.ObjectId, ref: 'Employee'},
	'status'		: Boolean
});

//creates employee manager from employeeManagerSchema
var EmployeeManager = mongoose.model('employeemanager', employeeManagerSchema);

module.exports = EmployeeManager;