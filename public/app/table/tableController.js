(function(){
	'use strict'
	var tableApp = angular.module('tableModule');

	tableApp.controller('tableController', ['$scope', '$stateParams', '$state','$mdToast', 'TableServices','AppServices', 
						function($scope, $stateParams, $state,$mdToast , TableServices, AppServices){
			$scope.tables = {};
			$scope.showCreateForm = false;
			
			$scope.option = {

			};

			$scope.fields = [
				{
					key: 'name',
					type: 'input',
					templateOptions: {
						label: 'Table Name: ',
						placeholder: 'Angular JS / Backbone JS'
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
							TableServices.GetTables().then(function(response){
								$scope.tables = response;
								
							});
							break;
					}
				});

			}

			$scope.showCreate = function()
			{
				$scope.showCreateForm = true;
			}

			var showTable = function(number){
				
				return $scope.table[number].name
			}
			
			$scope.goToUpdateTable = function(table){
				$scope.model = {
					_id: table._id,
					name: table.name,
					active: table.active
				};
				
				//console.log($scope.model);
				if($scope.showCreateForm == false)
				{
					$scope.showCreateForm = true;
					$state.go('app.table.update');
				}
			}

			$scope.updateTable = function(){
				TableServices.UpdateTable($scope.model).then(function(response){
				$mdToast.show(
					$mdToast.simple()
					.content('Attribute updated successfully')
					.action('x')
					.highlightAction(false)
					.hideDelay(3000)
					.position("top right")
					.theme('success-toast')
				);
				$state.go('app.table',	{}	, {	reload: true });	
				
			});
			}

			$scope.createTable = function(){
			
			TableServices.CreateTable($scope.model).then(function(response){
				$mdToast.show(
					$mdToast.simple()
					.content('Attribute added successfully')
					.action('x')
					.highlightAction(false)
					.hideDelay(3000)
					.position("top right")
					.theme('success-toast')
				);
				$state.go('app.table',	{}	, {	reload: true });	
				
			});
		}

		$scope.cancel = function(){
			$state.go('app.table',{}, {reload: true});
		}

		$scope.submit = function(){
			console.log($scope.model);
		}

	}]);

})();