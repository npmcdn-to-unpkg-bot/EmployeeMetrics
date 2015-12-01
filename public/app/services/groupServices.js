'use strict'
var groupApp = angular.module('groupModule');

groupApp.factory('GroupServices', GroupServices);

function GroupServices($http, $q){
	
	var GroupServices = {};

	var _getGroup = function(params){
		var deferred = $q.defer(); 
		$http.get('/group', {params : params}).success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;
	}

	var _createGroup = function(data){
		var deferred = $q.defer();
		$http.post('/group', data).success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	}

	var _updateGroup = function(data){		
		var deferred = $q.defer(); 
		$http.put('/group', data)
		.success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	}

	var _getGroups = function(){
		var deferred = $q.defer(); 
		$http.get('/groups').success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;
	}

	
	GroupServices.GetGroup 						= _getGroup;
	GroupServices.CreateGroup 					= _createGroup;
	GroupServices.UpdateGroup 					= _updateGroup;
	GroupServices.GetGroups 					= _getGroups;

	
	return GroupServices;

}