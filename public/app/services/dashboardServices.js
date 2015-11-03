'use strict'
var dashboardModule = angular.module('dashboardModule');

dashboardModule.factory('DashboardServices', DashboardServices);

function DashboardServices($http, $q){
	
	var DashboardServices = {};
/*
	var _getEmployees = function(){
		var deferred = $q.defer(); 
		
		$http.get('/employees').success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;
	}

	var _saveEmployee = function(data){
		var deferred = $q.defer();
		$http.post('/employee', data).success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	}


*/
	return DashboardServices;

}