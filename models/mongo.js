var mongoose = require('mongoose');

//Connects to the database people in mongoDB
mongoose.connect('mongodb://localhost:27017/people');

//Saves the schema object into mongoSchema
var mongoSchema = mongoose.Schema;

//Creates employee Schema
var employeeSchema = new mongoSchema({
	'_id'		: mongoSchema.ObjectId,
	'firstname'	: String,
	'lastname'	: String,
	'index'		: Number
});

//Creates employee from employeeSchema
var Employee = mongoose.model('Employee', employeeSchema);

//Creates categorySchema
var categorySchema = new mongoSchema({
	'_id'	: 	mongoSchema.ObjectId,
	'name'	: 	String
});

//Creates category from CategorySchema
var Category = mongoose.model('Category', categorySchema);

//Creates employee caetegory schema
var employeeCategorySchema = new mongoSchema({
	'_id'			: 	mongoSchema.ObjectId,
	'employeeId'	: 	{type: mongoSchema.ObjectId, ref: 'Employee'},
	'categoryId'	: 	{type: mongoSchema.ObjectId, ref: 'Category'},
	'Results'		: 	[
			Number, 
			Number, 
			Number, 
			Number	
		]
});

//Creates employeeCategory from employeeCategorySchema
var EmployeeCategory = mongoose.model('employees.categories', employeeCategorySchema);

//Exports all schemas created
module.exports = {
	Employee : Employee,
	Category : Category,
	EmployeeCategory : EmployeeCategory
};