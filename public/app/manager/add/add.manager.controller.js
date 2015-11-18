'use strict'
var managerModule = angular.module('managerModule');

managerModule.controller('addManagerController', ['$scope', '$rootScope', '$state', 'ManagerServices', 'EmployeeServices','AppServices', function($scope, $rootScope, $state ,ManagerServices, EmployeeServices, AppServices){
	
	$scope.employees = {};
	$scope.employeeSelected = {};
	
	$scope.initialize = function(){
		AppServices.GetAccess().then(function(data){
			switch(parseInt(data.access)){
				case 0:
				case 1:
					$state.go('logout');
					break;
				case 2:
					ManagerServices.GetEmployeesWithNoManager().then(function(response){
						
						$scope.employees = response;
					});
					
					break;
			}
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