'use strict'
var employeeApp = angular.module('employeeModule');

employeeApp.controller('viewEmployeeController', ['$scope','EmployeeServices', '$mdDialog',function($scope, EmployeeServices,$mdDialog){
	$scope.employees = {};
	
	$scope.initialize = function(){
		EmployeeServices.GetEmployees().then(function(response){
			$scope.employees = response;
			
		});
	}

	$scope.showCreate = function(ev){
		$mdDialog.show({
			//controller: createEmployeeController,
			//templateUrl: 'app/employees/create/create.employee.tmpl.html',
			clickOutsideToClose: true
		});
	}
}]);