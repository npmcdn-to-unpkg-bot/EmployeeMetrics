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
			console.log(response);
			$scope.employee = response[0];
		});


	}

	$scope.saveEmployee = function(){
		
		/*EmployeeServices.SaveEmployee(employee).then(function(response){
			console.log('data updated' + response);
			$state.go('employee',	{}	, {	reload: true });	
			
			
		});*/
		
			
	}

}]);