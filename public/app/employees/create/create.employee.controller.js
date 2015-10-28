'use strict'

var employeeApp = angular.module('employeeModule');

employeeApp.controller('createEmployeeController', ['$scope','$state','EmployeeServices' , function($scope, $state, EmployeeServices){
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
		$scope.employee.accesslevel = 0;
		$scope.employee.active = true;

	}

	$scope.saveEmployee = function(){
		var employee = $scope.employee;
		EmployeeServices.SaveEmployee(employee).then(function(response){
			console.log('data saved' + response);
			$state.go('employee',	{}	,{	reload: true	});	
			
			
		});
		
			
	}

}]);