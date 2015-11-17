'use strict'
var managerModule = angular.module('managerModule');

managerModule.controller('addManagerController', ['$scope', '$rootScope', '$state', 'ManagerServices', 'EmployeeServices', function($scope, $rootScope, $state ,ManagerServices, EmployeeServices){
	
	$scope.employees = {};
	$scope.employeeSelected = {};

	$scope.initialize = function(){
		
		ManagerServices.GetEmployeesWithNoManager().then(function(response){
			console.log(response);
			$scope.employees = response;
		});
	}

	$scope.addToManager = function(){

		var addData = {
			employeeId: $scope.employeeSelected.id,
			managerId : $state.params.id
		};

		ManagerServices.AddEmployeeToManager(addData).then(function(response){
			$state.go('app.manager-edit',{params: $state.params.id}, {	reload: true });
		});
	}
	

}]);