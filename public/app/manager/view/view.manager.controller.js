'use strict'
var managerModule = angular.module('managerModule');

managerModule.controller('viewManagerController', ['$scope', '$rootScope', '$state', 'ManagerServices', function($scope, $rootScope, $state ,ManagerServices){
	$scope.managers = {};
	$scope.showCreateForm = false;
	
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
		
		ManagerServices.GetManagers().then(function(response){
			$scope.managers = response;
			for (var i = 0 ; i < $scope.managers.length; i++){
				$scope.managers[i].accesslevelname = showAccessLevel($scope.managers[i].accesslevel);
			}
		});
	}

	$scope.showCreate = function()
	{
		$scope.showCreateForm = true;
	}

	var showAccessLevel = function(number){
		
		return $scope.accesslevels[number].name
	}
	
	$scope.employeesUnderManager = function(manager){
		$state.go('app.manager-edit', {'id': manager._id});
		
	}
}]);