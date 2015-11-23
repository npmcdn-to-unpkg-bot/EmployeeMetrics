'use strict'
var employeeApp = angular.module('categoryModule');

employeeApp.controller('viewCategoryController', ['$scope', '$stateParams', '$state','$mdToast', 'CategoryServices','AppServices', 
					function($scope, $stateParams, $state,$mdToast ,CategoryServices, AppServices){
	$scope.categories = {};
	$scope.showCreateForm = false;
	
	$scope.table = [{
		'id' : 0,
		'name' : 'Technology'
	},
	{
		'id' : 1,
		'name' : 'Training'
	},
	{
		'id' : 2,
		'name' : 'Continuous Evaluation'
	}];


	$scope.initialize = function(){
		AppServices.GetAccess().then(function(data){
			switch(parseInt(data.access)){
				case 0:
				case 1:
					$state.go('logout');
					break;
				case 2:
					CategoryServices.GetCategories().then(function(response){
						$scope.categories = response;
						for (var i = 0 ; i < $scope.categories.length; i++){
							$scope.categories[i].table = showTable($scope.categories[i].table);
						}
					});
					break;
			}
		});

	}

	$scope.showCreate = function()
	{
		$scope.showCreateForm = true;
	}

	var showTable = function(number){
		
		return $scope.table[number].name
	}
	
	$scope.updateCategory = function(category){
		
		if($scope.showCreateForm == false)
		{
			$scope.showCreateForm = true;
			$state.go('app.category.update', {'id': category._id});
						
		}
	}
}]);