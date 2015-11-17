/*
	employeejs 
	saves the employee schema
*/

'use strict'

var mongoose 	= 	require('mongoose');

//Saves the schema object into mongoSchema
var mongoSchema = mongoose.Schema;

//Creates employee Schema
var employeeSchema = new mongoSchema({
	'_id'			: mongoSchema.ObjectId,
	'firstname'		: String,
	'lastname'		: String,
	'email'			: String,
	'password'		: String,
	'accesslevel'	: Number,
	'active'		: Boolean
});

//Creates employee from employeeSchema
var Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;