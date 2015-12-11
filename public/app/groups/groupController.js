(function(){
	'use strict'
	var groupApp = angular.module('groupModule');

	groupApp.controller('groupController', ['$scope', '$stateParams', '$state','$mdToast', 'GroupServices','AppServices', 
						function($scope, $stateParams, $state,$mdToast , GroupServices, AppServices){
			$scope.groups = {};
			$scope.showCreateForm = false;
			
			$scope.option = {

			};

			$scope.fields = [
				{
					key: 'name',
					type: 'horizontalInput',
					templateOptions: {
						required: true,
						label: 'Group Name: ',
						placeholder: 'Front End Developers'
					}

				},
				{
					key: 'active',
					type: 'horizontalCheckbox',
					templateOptions: {
						label: 'Active',
						placeholder: 'Active'
					}
				}

			];

			$scope.initialize = function(){
								
				$scope.model = {
					name: '',
					active: true
				};

				AppServices.GetAccess().then(function(data){
					switch(parseInt(data.access)){
						case 0:
						case 1:
							$state.go('logout');
							break;
						case 2:
							GroupServices.GetGroups().then(function(response){
								$scope.groups = response;
								for(var i = 0; i< response.length;i++){
									$scope.groups[i].active = response[i].active ? "Active" : 'Inactive'
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

	
			
			$scope.goToUpdateGroup = function(group){
				$scope.model = {
					_id: group._id,
					name: group.name,
					active: group.active
				};
				
				//console.log($scope.model);
				if($scope.showCreateForm == false)
				{
					$scope.showCreateForm = true;
					$state.go('app.group.update');
				}
			}

			$scope.updateGroup = function(){
				if($scope.model.name == '' || $scope.model.name == null){
					$mdToast.show(
							$mdToast.simple()
							.content('It cannot be a required field empty')
							.action('x')
							.highlightAction(false)
							.hideDelay(3000)
							.position("top right")
							.theme('error-toast')
						);
				}else{
					GroupServices.UpdateGroup($scope.model).then(function(response){
						$mdToast.show(
							$mdToast.simple()
							.content('group updated successfully')
							.action('x')
							.highlightAction(false)
							.hideDelay(3000)
							.position("top right")
							.theme('success-toast')
						);
						$state.go('app.group',	{}	, {	reload: true });	
					
					});
				}
			}
			
			$scope.createGroup = function(){
			
				if($scope.model.name == '' || $scope.model.name == null){
					$mdToast.show(
							$mdToast.simple()
							.content('It cannot be a required field empty')
							.action('x')
							.highlightAction(false)
							.hideDelay(3000)
							.position("top right")
							.theme('error-toast')
						);
				}else{
					GroupServices.CreateGroup($scope.model).then(function(response){
						$mdToast.show(
							$mdToast.simple()
							.content('Attribute added successfully')
							.action('x')
							.highlightAction(false)
							.hideDelay(3000)
							.position("top right")
							.theme('success-toast')
						);
						$state.go('app.group',	{}	, {	reload: true });	
						
					});
				}
			}

		$scope.cancel = function(){
			$state.go('app.group',{}, {reload: true});
		}

		$scope.submit = function(){
			console.log($scope.model);
		}

	}]);

})();