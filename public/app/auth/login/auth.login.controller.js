var app = angular.module('myApp');

app.controller('authLoginController',['$scope','$mdToast', '$state' , '$window', 'AppServices', function($scope, $mdToast, $state, $window, AppServices){
	$scope.loginForm = {};
	

	$scope.sendLogin = function(){
	
		AppServices.Login($scope.loginForm).then(function(data){
			
			if (data.error == false)
			{	
				$state.go('app.dashboard');
			}else{
				$mdToast.show(
					$mdToast.simple()
					.content('User and password do not match please try again')
					.action('x')
					.highlightAction(false)
					.hideDelay(3000)
					.position("top right")
					.theme('error-toast')
				);
			
				
			}
		});
	}

	$scope.initialize = function(){

	}

}]);