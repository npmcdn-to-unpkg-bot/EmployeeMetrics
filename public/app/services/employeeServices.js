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

	var _getEmployeesOnly = function(){
		var deferred = $q.defer(); 
		$http.get('/employeesonly').success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;
	}

	var _getEmployee = function(params){
		var deferred = $q.defer();
		
		$http.get('/employee', {params: params}).success(function(data){
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

	var _updateEmployee = function(data){
		var deferred = $q.defer();
		$http.put('/employee', data, {id: data._id}).success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	}
	

	EmployeeServices.GetEmployees	= _getEmployees;
	EmployeeServices.GetEmployeesOnly = _getEmployeesOnly;
	EmployeeServices.SaveEmployee 	= _saveEmployee;
	EmployeeServices.GetEmployee	= _getEmployee;
	EmployeeServices.UpdateEmployee = _updateEmployee;

	return EmployeeServices;

}