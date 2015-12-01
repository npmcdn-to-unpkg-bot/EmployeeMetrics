'use strict'
var tableApp = angular.module('tableModule');

tableApp.factory('TableServices', TableServices);

function TableServices($http, $q){
	
	var TableServices = {};

	var _getTable = function(params){
		var deferred = $q.defer(); 
		$http.get('/table', {params : params}).success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;
	}

	var _createTable = function(data){
		var deferred = $q.defer();
		$http.post('/table', data).success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	}

	var _updateTable = function(data){		
		var deferred = $q.defer(); 
		$http.put('/table', data)
		.success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	}

	var _getTables = function(){
		var deferred = $q.defer(); 
		$http.get('/tables').success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;
	}

	
	TableServices.GetTable 						= _getTable;
	TableServices.CreateTable 					= _createTable;
	TableServices.UpdateTable 					= _updateTable;
	TableServices.GetTables 					= _getTables;

	
	return TableServices;

}