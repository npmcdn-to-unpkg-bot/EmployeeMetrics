'use strict'

var employeeApp = angular.module('employeeModule');

employeeApp.controller('createEmployeeController', ['$scope', '$rootScope','$state','EmployeeServices','AppServices' , function($scope, $rootScope,$state, EmployeeServices, AppServices){
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
					$scope.employee.accesslevel = 0;
					$scope.employee.active = true;
					
					break;
			}
		});

	}

	$scope.saveEmployee = function(){
		
		var employee = $scope.employee;
		EmployeeServices.SaveEmployee(employee).then(function(response){
			console.log('data saved' + response);
			$state.go('app.employee',	{}	,{	reload: true	});	
			
			
		});
		
			
	}

}]);