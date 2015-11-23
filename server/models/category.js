/*
	category js
	defines categories schemas
*/

//Saves the schema object into mongoSchema
'use strict'

var mongoose 	= 	require('mongoose');

var mongoSchema = mongoose.Schema;

//Creates categorySchema
var categorySchema = new mongoSchema({
	'_id'	: 	mongoSchema.ObjectId,
	'name'	: 	String,
	'table'	: 	Number,
	'active':   Boolean,
});

//Creates category from CategorySchema
var Category = mongoose.model('Category', categorySchema);

module.exports = Category;