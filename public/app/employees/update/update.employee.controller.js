'use strict'

var employeeApp = angular.module('employeeModule');

employeeApp.controller('updateEmployeeController', ['$scope', '$rootScope', '$state', '$stateParams','EmployeeServices','AppServices' ,function($scope, $rootScope, $state, $stateParams, EmployeeServices,AppServices){
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
		AppServices.GetAccess().then(function(data){
			switch(parseInt(data.access)){
				case 0:
				case 1:
					$state.go('logout');
					break;
				case 2:
					
					break;
			}
		});
		

		EmployeeServices.GetEmployee($state.params).then(function(response){
			$scope.employee = response[0];
			$scope.employee.accesslevel = parseInt(response[0].accesslevel);
		});
	}

	$scope.updateEmployee = function(){
		
		EmployeeServices.UpdateEmployee($scope.employee).then(function(response){
			$state.go('app.employee',	{}	, {	reload: true });	
			
		});
	}

	$scope.changePassword = function(params){
		
		$state.go('app.forcepassword',{id: params});
	}

}]);