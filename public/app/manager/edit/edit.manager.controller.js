'use strict'
var managerModule = angular.module('managerModule');

managerModule.controller('editManagerController', ['$scope', '$rootScope', '$state', 'ManagerServices', 'EmployeeServices', function($scope, $rootScope, $state ,ManagerServices, EmployeeServices){
	
	$scope.managerEmployee = {};
	$scope.manager ={};
	$scope.employees = {};

	$scope.initialize = function(){
		$rootScope.validate();
		var params = {'id': $state.params.id};

		EmployeeServices.GetEmployee(params).then(function(response){
			$scope.manager._id = response[0]._id;
			$scope.manager.firstname = response[0].firstname;
			$scope.manager.lastname = response[0].lastname;
		});
		
		ManagerServices.GetEmployeeUnderManger(params).then(function(response){
			
			if (response.length == 0){
				$scope.managerEmployee = {};	
			}else{
				$scope.managerEmployee = response;
				
		
				for(var i = 0; i < $scope.managerEmployee.length;i++){
					

					var employeeParams = {'id' : $scope.managerEmployee[i].employeeId};
					
					getEmployeesName(employeeParams,i);
					
					
				}
			}
		});
	}

	$scope.addEmployeeToManager = function(){
		$state.go('app.manager-edit.add', {params: $state.params.id});
	}


	function getEmployeesName(employeeParams,index){
		EmployeeServices.GetEmployee(employeeParams).then(function(response){
			$scope.managerEmployee[index].firstname = response[0].firstname;
			$scope.managerEmployee[index].lastname = response[0].lastname;
		});
	}

	$scope.employeeInactive = function(employeeId){

	}
}]);