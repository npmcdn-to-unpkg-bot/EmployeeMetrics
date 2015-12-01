(function(){
	'use strict'
	var aspectApp = angular.module('aspectModule');

	aspectApp.controller('aspectController', ['$scope', '$stateParams', '$state','$mdToast', 'AspectServices','AppServices', 
						function($scope, $stateParams, $state,$mdToast , AspectServices, AppServices){
			$scope.aspects = {};
			$scope.showCreateForm = false;
			
			$scope.table = [{
				'id' : 0,
				'name' : 'Technology'
			},
			{
				'id' : 1,
				'name' : 'Training'
			},
			{
				'id' : 2,
				'name' : 'Continuous Evaluation'
			}];



			

			$scope.option = {

			};

			$scope.fields = [
				{
					key: 'name',
					type: 'input',
					templateOptions: {
						label: 'Attribute Name: ',
						placeholder: 'Angular JS / Backbone JS'
					}

				},
				{
					key: 'table',
					type: 'select',
					templateOptions: {
						label: 'Table',
						options: $scope.table,
						ngOptions: 'option.id as option.name for option in to.options'
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
					table: null,
					active: true
				};

				AppServices.GetAccess().then(function(data){
					switch(parseInt(data.access)){
						case 0:
						case 1:
							$state.go('logout');
							break;
						case 2:
							AspectServices.GetAspects().then(function(response){
								$scope.aspects = response;
								for (var i = 0 ; i < $scope.aspects.length; i++){
									$scope.aspects[i].tableName = showTable($scope.aspects[i].table);
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

			var showTable = function(number){
				
				return $scope.table[number].name
			}
			
			$scope.goToUpdateAspect = function(aspect){
				$scope.model = {
					_id: aspect._id,
					name: aspect.name,
					table: aspect.table,
					active: aspect.active
				};
				
				//console.log($scope.model);
				if($scope.showCreateForm == false)
				{
					$scope.showCreateForm = true;
					$state.go('app.aspect.update');
				}
			}

			$scope.updateAspect = function(){
				AspectServices.UpdateAspect($scope.model).then(function(response){
				$mdToast.show(
					$mdToast.simple()
					.content('Attribute updated successfully')
					.action('x')
					.highlightAction(false)
					.hideDelay(3000)
					.position("top right")
					.theme('success-toast')
				);
				$state.go('app.aspect',	{}	, {	reload: true });	
				
			});
			}

			$scope.createAspect = function(){
			
			AspectServices.CreateAspect($scope.model).then(function(response){
				$mdToast.show(
					$mdToast.simple()
					.content('Attribute added successfully')
					.action('x')
					.highlightAction(false)
					.hideDelay(3000)
					.position("top right")
					.theme('success-toast')
				);
				$state.go('app.aspect',	{}	, {	reload: true });	
				
			});
		}

		$scope.cancel = function(){
			$state.go('app.aspect',{}, {reload: true});
		}

		$scope.submit = function(){
			console.log($scope.model);
		}

	}]);

})();