'use strict'
var employeeModule = angular.module('employeeModule');

employeeModule.factory('EmployeeServices', EmployeeServices);

function EmployeeServices($http, $q){
	
	var EmployeeServices = {};

	var _getEmployees = function(){
		var deferred = $q.defer(); 
		$http.get('/employees').success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;
	}

	
	

	EmployeeServices.GetEmployees	= _getEmployees;
	return EmployeeServices;

}