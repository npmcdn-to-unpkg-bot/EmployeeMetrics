var app = angular.module('myApp');

app.controller('changePasswordController',['$scope','$mdToast', '$state' , '$window', 'AppServices', 'EmployeeServices', function($scope, $mdToast, $state, $window, AppServices, EmployeeServices){
	
	$scope.passowrd = {}
	
	

	$scope.message = '';
	$scope.initialize = function()
	{
		
		$scope.success = false;
	}

	$scope.changePassword = function()
	{
		var params = {};
		params = $scope.password;
		if ($scope.password.newPassword == $scope.password.repeatPassword){
			$scope.alert = false;
			params._id = $state.params.id;

			
			AppServices.ChangePassword(params).then(function(response){
				if(response.error == true){
					$scope.alert = true;
					$mdToast.show(
						$mdToast.simple()
						.content(response.message)
						.action('x')
						.highlightAction(false)
						.hideDelay(3000)
						.position("top right")
						.theme('error-toast')
					);
				}else{
					if (response != 'Unauthorized'){
						$mdToast.show(
							$mdToast.simple()
							.content(response.message)
							.action('x')
							.highlightAction(false)
							.hideDelay(3000)
							.position("top right")
							.theme('success-toast')
						);
						$state.go('app.dashboard');
					}
				}

			});
			
		}else{
			$mdToast.show(
				$mdToast.simple()
				.content('Passwords do not match')
				.action('x')
				.highlightAction(false)
				.hideDelay(3000)
				.position("top right")
				.theme('error-toast')
			);
			
		}
	}

	$scope.setFalse=function(){
		$scope.success = false;
		$scope.alert = false;
	}
}]);