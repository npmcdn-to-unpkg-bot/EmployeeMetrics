var mongoose = require('mongoose');

//Saves the schema object into mongoSchema
var mongoSchema = mongoose.Schema;


//Creates employee caetegory schema
var employeeCategorySchema = new mongoSchema({
	'_id'			: 	mongoSchema.ObjectId,
	'employeeId'	: 	{type: mongoSchema.ObjectId, ref: 'Employee'},
	'managerId'		: 	{type: mongoSchema.ObjectId, ref: 'Employee'},
	'tableId'		: 	{type: mongoSchema.ObjectId, ref: 'Table'},
	'categoryId'	: 	{type: mongoSchema.ObjectId, ref: 'Category'},
	'aspectId'		: 	{type: mongoSchema.ObjectId, ref: 'Aspect'},
	'date'			: 	Date,
	'Results'		: 	Number
		
});


//Creates employeeCategory from employeeCategorySchema
var EmployeeCategory = mongoose.model('employees.categories', employeeCategorySchema);

module.exports = EmployeeCategory;