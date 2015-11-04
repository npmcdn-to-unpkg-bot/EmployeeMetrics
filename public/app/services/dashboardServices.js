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
	var _getManagerDashboard = function(params){
		var deferred = $q.defer(); 
		
		$http.get('/managerdashboard',{params:params}).success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;
	}

	var _getUserDashboard = function(params){
		var deferred = $q.defer(); 
		
		$http.get('/userdashboard',{params:params}).success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;
	}

	DashboardServices.GetManagerDashboard = _getManagerDashboard;
	DashboardServices.GetUserDashboard    = _getUserDashboard;
	return DashboardServices;

}