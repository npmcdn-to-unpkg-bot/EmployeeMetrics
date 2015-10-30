var app = angular.module('myApp');

app.controller('authLogoutController',['$scope','$rootScope', '$state' , '$window', 'AppServices', function($scope, $rootScope, $state, $window, AppServices){

	$scope.initialize = function(){

		
		$window.sessionStorage.token = null;
		delete $window.sessionStorage.token;


	}

}]);