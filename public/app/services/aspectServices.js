'use strict'
var attributeApp = angular.module('aspectModule');

attributeApp.factory('AspectServices', AspectServices);

function AspectServices($http, $q){
	
	var AspectServices = {};

	var _getAspect = function(params){
		var deferred = $q.defer(); 
		$http.get('/aspect', {params : params}).success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;
	}

	var _createAspect = function(data){
		var deferred = $q.defer();
		$http.post('/aspect', data).success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	}

	var _updateAspect = function(data){		
		var deferred = $q.defer(); 
		$http.put('/aspect', data)
		.success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	}

	var _getAspects = function(){
		var deferred = $q.defer(); 
		$http.get('/aspects').success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;
	}

	
	AspectServices.GetAspect 						= _getAspect;
	AspectServices.CreateAspect 					= _createAspect;
	AspectServices.UpdateAspect 					= _updateAspect;
	AspectServices.GetAspects 						= _getAspects;

	
	return AspectServices;

}