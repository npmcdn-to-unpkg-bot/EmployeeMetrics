var app = angular.module('myApp');

app.controller('authLoginController',['$scope','$rootScope', '$state' , '$window', 'AppServices', function($scope, $rootScope, $state, $window, AppServices){
	$scope.loginForm = {};
	$scope.message = false;

	$scope.sendLogin = function(){
	
		AppServices.Login($scope.loginForm).then(function(data){
			if (data != '' && data !=null)
			{	
				$window.sessionStorage.token = data;
				$state.go('app.dashboard');
			}else{
				$window.sessionStorage.token=null;
				$scope.message = false;
				$scope.message = true;
			}
		});
	}

	$scope.initialize = function(){

	}

}]);