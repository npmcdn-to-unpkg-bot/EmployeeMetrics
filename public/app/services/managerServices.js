'use strict'
var managerModule = angular.module('managerModule');

managerModule.factory('ManagerServices', ManagerServices);

function ManagerServices($http, $q){
	var ManagerServices = {};

	var _getManagers = function(){
		var deferred = $q.defer(); 
		$http.get('/managers').success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;
	}

	var _getManager = function(params){
		var deferred = $q.defer(); 
		$http.get('/manager', {params: params}).success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;	
	}

	var _addEmployeeToManager = function(data){
		var deferred = $q.defer(); 
		$http.post('/manager', data)	//Config and parameters sent to the post
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(data){
				deferred.resolve(data);
				
			});
		return deferred.promise;
	}

	var _getEmployeeUnderManger = function(params){
		var deferred = $q.defer(); 
		$http.get('/employee-managers', {params: params}).success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;	

	}


	ManagerServices.GetManagers 			= _getManagers;
	ManagerServices.AddEmployeeToManager  	= _addEmployeeToManager;
	ManagerServices.GetEmployeeUnderManger	=	_getEmployeeUnderManger
	return ManagerServices;
}