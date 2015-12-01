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
					type: 'input',
					templateOptions: {
						label: 'Group Name: ',
						placeholder: 'Front End Developers'
					}

				},
				{
					key: 'active',
					type: 'checkbox',
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

			$scope.createGroup = function(){
			
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

		$scope.cancel = function(){
			$state.go('app.group',{}, {reload: true});
		}

		$scope.submit = function(){
			console.log($scope.model);
		}

	}]);

})();