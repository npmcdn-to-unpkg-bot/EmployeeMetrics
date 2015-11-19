'use strict'
var managerModule = angular.module('managerModule');

managerModule.controller('addManagerController', ['$scope', '$mdToast', '$state', 'ManagerServices', 'EmployeeServices','AppServices', function($scope, $mdToast, $state ,ManagerServices, EmployeeServices, AppServices){
	
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
			var themeString = "";
			if(response.error){
				themeString = 'error-toast';
			}
			else{
				themeString = 'success-toast';
			}
			
			$mdToast.show(
				$mdToast.simple()
				.content(response.message)
				.action('x')
				.highlightAction(false)
				.hideDelay(5000)
				.position("top right")
				.theme(themeString)
			);
			$state.go('app.manager-edit',{params: $state.params.id}, {	reload: true });
		});
	}
	

}]);