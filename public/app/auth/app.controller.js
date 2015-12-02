var app = angular.module('myApp');

app.controller('appController',['$scope', '$state' , '$window', 'AppServices','EmployeeServices', 'TableServices', 
						function($scope, $state, $window, AppServices, EmployeeServices, TableServices){
	$scope.loginForm = {};
	
	
	$scope.accesslevel	= NaN;

	$scope.employee	= false;
	$scope.manager	= false;
	$scope.admin	= false;
	$scope.tables = [];
	$scope.personLoged = {};

	$scope.getAccess = function(){
		var accesslevel = NaN;
				
		AppServices.GetAccess().then(function(data){
			switch(parseInt(data.access)){
				case 0:
					$scope.employee = true;		
					break;
				case 1:
					$scope.manager = true;		
					break;
				case 2:
					$scope.admin = true;		
					break;
				default:
					$scope.employee	= false;
					$scope.manager	= false;
					$scope.admin	= false;					
					break;


			}

		});
	}

	$scope.getPersonFromToken = function(){
		
		EmployeeServices.GetEmployee().then(function(response){
			$scope.personLoged = response;
			var params = {group: response.group};
			TableServices.GetTables(params).then(function(response){
				$scope.tables = response;
				
			});
		});
	}

	$scope.initialize = function(){
		$scope.getAccess();
		$scope.getPersonFromToken();
	}

}]);