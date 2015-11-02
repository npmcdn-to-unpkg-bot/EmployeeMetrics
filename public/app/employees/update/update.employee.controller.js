'use strict'

var employeeApp = angular.module('employeeModule');

employeeApp.controller('updateEmployeeController', ['$scope', '$rootScope', '$state', '$stateParams','EmployeeServices' ,function($scope, $rootScope, $state, $stateParams, EmployeeServices){
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
		$rootScope.validate();
		

		EmployeeServices.GetEmployee($state.params).then(function(response){
			$scope.employee = response[0];
			$scope.employee.accesslevel = parseInt(response[0].accesslevel);
		});
	}

	$scope.updateEmployee = function(){
		$rootScope.validate();
		EmployeeServices.UpdateEmployee($scope.employee).then(function(response){
			$state.go('app.employee',	{}	, {	reload: true });	
			
		});
		
			
	}

}]);