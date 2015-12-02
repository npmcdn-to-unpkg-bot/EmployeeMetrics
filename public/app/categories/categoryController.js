(function(){
	'use strict'
	var categoryApp = angular.module('categoryModule');

	categoryApp.controller('categoryController', ['$scope', '$stateParams', '$state','$mdToast', 'CategoryServices','AppServices', 'TableServices',
						function($scope, $stateParams, $state,$mdToast , CategoryServices, AppServices, TableServices){
			$scope.categories = {};
			$scope.showCreateForm = false;
			
			$scope.tables = [];

			var loadFields = function(){
				$scope.fields = [
					{
						key: 'name',
						type: 'horizontalInput',
						templateOptions: {
							label: 'Category Name: ',
							placeholder: 'Angular JS / Backbone JS'
						}

					},
					{
						key: 'table',
						type: 'horizontalSelect',
						templateOptions: {
							label: 'Table',
							options: $scope.tables,
							ngOptions: 'option._id as option.name for option in to.options'
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
								CategoryServices.GetCategories().then(function(response){
									$scope.categories = response;
									
									for (var i = 0 ; i < $scope.categories.length; i++){
										
										for(var j = 0; j < $scope.tables.length; j++){
											
											if($scope.categories[i].table == $scope.tables[j]._id){
												$scope.categories[i].tableName = $scope.tables[j].name;
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
			}


			
			$scope.goToUpdateCategory = function(category){
				$scope.model = {
					_id: category._id,
					name: category.name,
					table: category.table,
					active: category.active
				};
				
				//console.log($scope.model);
				if($scope.showCreateForm == false)
				{
					$scope.showCreateForm = true;
					$state.go('app.category.update');
				}
			}

			$scope.updateCategory = function(){
				CategoryServices.UpdateCategory($scope.model).then(function(response){
					$mdToast.show(
						$mdToast.simple()
						.content('Attribute updated successfully')
						.action('x')
						.highlightAction(false)
						.hideDelay(3000)
						.position("top right")
						.theme('success-toast')
					);
					$state.go('app.category',	{}	, {	reload: true });	
				
				});
			}

			$scope.createCategory = function(){
			
			CategoryServices.CreateCategory($scope.model).then(function(response){
				$mdToast.show(
					$mdToast.simple()
					.content('Attribute added successfully')
					.action('x')
					.highlightAction(false)
					.hideDelay(3000)
					.position("top right")
					.theme('success-toast')
				);
				$state.go('app.category',	{}	, {	reload: true });	
				
			});
		}

		$scope.cancel = function(){
			$scope.model = {
				_id: '',
				name: '',
				table: '',
				active: true
			};
			$state.go('app.category',{}, {reload: true});
		}

		$scope.submit = function(){
			console.log($scope.model);
		}

	}]);

})();