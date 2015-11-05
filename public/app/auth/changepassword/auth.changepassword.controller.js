var app = angular.module('myApp');

app.controller('changePasswordController',['$scope','$rootScope', '$state' , '$window', 'AppServices', 'EmployeeServices', function($scope, $rootScope, $state, $window, AppServices, EmployeeServices){
	
	$scope.passowrd = {}
	
	$scope.noMatch = false;

	$scope.initialize = function()
	{
		$rootScope.validate();
		
	}

	$scope.changePassword = function()
	{
		var params = {};
		params = $scope.password;
		if ($scope.password.newPassword == $scope.password.repeatPassword){
			$scope.noMatch = false;
			params.id = $state.params.id;
			if(params.id == undefined)
			{
				params.token = $window.sessionStorage.token;
			}
			console.log(params)
			AppServices.ChangePassword(params).then(function(response){
				if(response.error == true){
					console.log(response.message);
				}else{
					$state.go('app.dashboard');
				}

			});
			
		}else{
			$scope.noMatch = true;
		}



	}
}]);