/*
	group js
	defines group schemas
*/

//Saves the schema object into mongoSchema
'use strict'

var mongoose 	= 	require('mongoose');

var mongoSchema = mongoose.Schema;

//Creates categorySchema
var GroupSchema = new mongoSchema({
	'_id'	: 	mongoSchema.ObjectId,
	'name'	: 	String,
	'active':   Boolean,
});

//Creates category from CategorySchema
var Group = mongoose.model('Group', GroupSchema);

module.exports = Group;