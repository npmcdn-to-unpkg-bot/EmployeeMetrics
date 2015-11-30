/*
	attributes js
	defines attributes schemas
*/

//Saves the schema object into mongoSchema
'use strict'

var mongoose 	= 	require('mongoose');

var mongoSchema = mongoose.Schema;

//Creates categorySchema
var aspectSchema = new mongoSchema({
	'_id'	: 	mongoSchema.ObjectId,
	'name'	: 	String,
	'table'	: 	Number,
	'active':   Boolean,
});

//Creates category from CategorySchema
var Aspect = mongoose.model('Aspect', aspectSchema);

module.exports = Aspect;