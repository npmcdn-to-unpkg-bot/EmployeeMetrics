'use strict'
var categoryApp = angular.module('categoryModule');

categoryApp.factory('CategoryServices', CategoryServices);

function CategoryServices($http, $q){
	
	var CategoryServices = {};

	var _getCategory = function(params){
		var deferred = $q.defer(); 
		$http.get('/category', {params : params}).success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;
	}

	var _createCategory = function(data){
		var deferred = $q.defer();
		$http.post('/category', data).success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	}

	var _updateCategory = function(data){		
		var deferred = $q.defer(); 
		$http.put('/category', data)
		.success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	}

	var _getCategories = function(){
		var deferred = $q.defer(); 
		$http.get('/categories').success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;
	}

	
	CategoryServices.GetCategory 						= _getCategory;
	CategoryServices.CreateCategory 					= _createCategory;
	CategoryServices.UpdateCategory 					= _updateCategory;
	CategoryServices.GetCategories 						= _getCategories;

	
	return CategoryServices;

}