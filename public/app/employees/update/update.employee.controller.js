'use strict'

var employeeApp = angular.module('employeeModule');

employeeApp.controller('updateEmployeeController', ['$scope','$state', '$stateParams','EmployeeServices' ,function($scope, $state, $stateParams, EmployeeServices){
	$scope.employee = {};
	
	$scope.accesslevels = [{
		'id' : 0,
		'name' : 'Employee'
	},
	{
		'id' : 1,
		'name' : 'Manager'
	},
	{
		'id' : 2,
		'name' : 'Administrator'
	}];

	$scope.initialize = function(){
		var id = $state.params.id
		EmployeeServices.GetEmployee(id).then(function(response){
			$scope.employee = response[0];
			$scope.employee.accesslevel = parseInt(response[0].accesslevel);
		});


	}

	$scope.showMeTest = function(number){
		
	}

	$scope.updateEmployee = function(){
		
		EmployeeServices.UpdateEmployee($scope.employee).then(function(response){
			$state.go('employee',	{}	, {	reload: true });	
			
		});
		
			
	}

}]);