/*
	table js
	defines attributes schemas
*/

//Saves the schema object into mongoSchema
'use strict'

var mongoose 	= 	require('mongoose');

var mongoSchema = mongoose.Schema;

//Creates categorySchema
var TableSchema = new mongoSchema({
	'_id'	: 	mongoSchema.ObjectId,
	'name'	: 	String,
	'group'	: 	{type: mongoSchema.ObjectId, ref: 'Group'},
	'active':   Boolean,
});

//Creates category from CategorySchema
var Table = mongoose.model('Table', TableSchema);

module.exports = Table;