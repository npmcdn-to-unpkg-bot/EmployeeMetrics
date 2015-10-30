var app = angular.module('myApp');

app.controller('appController',['$scope','$rootScope', '$state' , '$window', 'AppServices', function($scope, $rootScope, $state, $window, AppServices){
	$scope.loginForm = {};
	
	
	$scope.accesslevel	= NaN;

	$scope.employee	= false;
	$scope.manager	= false;
	$scope.admin	= false;

	$rootScope.validate = function(){
		
		var token = {
			token: $window.sessionStorage.token
		};
		AppServices.ValidateToken(token).then(function(data){
			if(data == false){
				$state.go('logout');
			};
		});
	}

	$scope.getAccess = function(){
		var accesslevel = NaN;
		var token = {
			token: $window.sessionStorage.token
		};
		$rootScope.validate();
		AppServices.GetAccess(token).then(function(access){
			
			switch(parseInt(access)){
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

	$scope.initialize = function(){
		$scope.getAccess();
	}

}]);