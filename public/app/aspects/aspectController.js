(function(){
	'use strict'
	var aspectApp = angular.module('aspectModule');

	aspectApp.controller('aspectController', ['$scope', '$stateParams', '$state','$mdToast', 'AspectServices','AppServices', 'TableServices', 'GroupServices',
						function($scope, $stateParams, $state,$mdToast , AspectServices, AppServices, TableServices, GroupServices){
			$scope.aspects = {};
			$scope.showCreateForm = false;
			$scope.searchShow = false;
			$scope.tables = [];

			var loadFields = function(){
				$scope.fields = [
					{
						key: 'name',
						type: 'horizontalInput',
						templateOptions: {
							label: 'Attribute Name: ',
							required: true,
							placeholder: 'Angular JS / Backbone JS'
						}

					},
					{
						key: 'table',
						type: 'horizontalSelect',
						templateOptions: {
							label: 'Table',
							required: true,
							options: $scope.tables,
							ngOptions: 'option._id as option.groupShow for option in to.options'
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
				
				$scope.filterFields = [
					{
						key: 'name',
						type: 'horizontalInput',
						templateOptions: {
							label: 'Attribute Name: ',
							placeholder: 'Angular JS / Backbone JS'
						}

					},
					{
						key: 'table',
						type: 'horizontalSelect',
						templateOptions: {
							label: 'Table',
							options: $scope.tables,
							ngOptions: 'option._id as option.groupShow for option in to.options'
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
			}
			

			$scope.option = {

			};

			

			$scope.initialize = function(){
				$scope.searchShow = false;				
				$scope.model = {
					_id: '',
					name: '',
					table: '',
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
								loadFields();
								GroupServices.GetGroups().then(function(response){
									$scope.groups = response;
									for(var i = 0; i< $scope.tables.length; i++){
										for (var j = 0; j< $scope.groups.length; j++){
											if ($scope.groups[j]._id == $scope.tables[i].group){
												$scope.tables[i].groupName = $scope.groups[j].name;
												$scope.tables[i].groupShow = $scope.tables[i].name + ' - '+ $scope.tables[i].groupName;
												break;
											}
										}
									}
								});
								AspectServices.GetAspects().then(function(response){
									$scope.aspects = response;
									
									for (var i = 0 ; i < $scope.aspects.length; i++){
										$scope.aspects[i].activeString = $scope.aspects[i].active ? "Active" : "Inactive";
										for(var j = 0; j < $scope.tables.length; j++){
											
											if($scope.aspects[i].table == $scope.tables[j]._id){
												$scope.aspects[i].tableName = $scope.tables[j].name;
												$scope.aspects[i].groupName = $scope.tables[j].groupName;
												break;
											}
											
										}
									}
								});
							});
							break;
					}
				});

			}

			$scope.showCreate = function()
			{
				$scope.showCreateForm = true;
				$scope.searchShow = false;
			}


			
			$scope.goToUpdateAspect = function(aspect){
				$scope.searchShow = false;
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
				if($scope.model.name == '' || $scope.model.table == '' || $scope.model.name == null || $scope.model.table == null){
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
			}

			$scope.createAspect = function(){
				if($scope.model.name == '' || $scope.model.table == '' || $scope.model.name == null || $scope.model.table == null){
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
			}	

		$scope.cancel = function(){
			$scope.model = {
				_id: '',
				name: '',
				table: '',
				active: true
			};
			$state.go('app.aspect',{}, {reload: true});
		}

		$scope.submit = function(){
			console.log($scope.model);
		}

		$scope.clearFilter = function(){
			$scope.q = [];
		}

		$scope.openFilter = function(){
			$scope.searchShow = true;
		}
		$scope.closeFilter = function(){
			$scope.searchShow = false;
		}

	}]);

})();