var app = angular.module('myApp');

app.controller('authLoginController',['$scope','$rootScope', '$state' , '$window', 'AppServices', function($scope, $rootScope, $state, $window, AppServices){
	$scope.loginForm = {};
	$scope.message = false;

	$scope.sendLogin = function(){
	
		AppServices.Login($scope.loginForm).then(function(data){
			
			if (data.error == false)
			{	
				$window.sessionStorage.token = data.message;
				$state.go('app.dashboard');
			}else{
				$window.sessionStorage.token=null;
				delete $window.sessionStorage.token;
				$scope.message = false;
				$scope.message = true;
				
			}
		});
	}

	$scope.initialize = function(){
		$window.sessionStorage.token=null;
		delete $window.sessionStorage.token;
	}

}]);