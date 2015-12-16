(function(){
	'use strict'
	var tableApp = angular.module('tableModule');

	tableApp.controller('tableController', ['$scope', '$stateParams', '$state','$mdToast', 'TableServices','AppServices','GroupServices', 'CategoryServices', 'AspectServices',
						function($scope, $stateParams, $state,$mdToast , TableServices, AppServices, GroupServices, CategoryServices, AspectServices){
			$scope.tables = {};
			$scope.showCreateForm = false;
			
			$scope.option = {

			};


			var color = {
				mix 	: ['#001f3f','#39CCCC','#2ECC40','#3D9970','#FF851B','#FFDC00','#FF4136','#B10DC9','#111111','#AAAAAA']
			};

			var options = 
			{	
				responsive: true,
				animation: true,
				scaleOverride : true,
				scaleShowGridLines : true,
				scaleGridLineColor : "rgba(0,0,0,.05)",
				scaleShowVerticalLines: true,
				scaleShowHorizontalLines: true,
				showXLabels: 8,
				showScale: true,
				scaleSteps : 2,
				scaleStepWidth : 1,
				scaleStartValue : 1,
				showTooltips: false,
				multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>" ,
				scaleFontColor: '#222'   
				
			}

			$scope.searchShow = false;

			var loadFields=function(){
				$scope.fields = [
					{
						key: 'name',
						type: 'horizontalInput',
						templateOptions: {
							required: true,
							label: 'Table Name: ',
							placeholder: 'Continuous Evaluation'
						}

					},
					{
						key: 'group',
						type: 'horizontalSelect',
						templateOptions: {
							required: true,
							label: 'User Group: ',
							options: $scope.groups,
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

				$scope.filterFields = [
					{
						key: 'name',
						type: 'horizontalInput',
						templateOptions: {
							label: 'Table Name: ',
							placeholder: 'Continuous Evaluation'
						}

					},
					{
						key: 'group',
						type: 'horizontalSelect',
						templateOptions: {
							label: 'User Group: ',
							options: $scope.groups,
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

			$scope.initialize = function(){
				
				$scope.searchShow = false;	
				$scope.model = {
					_id: '',
					name: '',
					group: '',
					active: true,
					activeString: '',
					groupName: ''
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
								TableServices.GetTables().then(function(response){
									$scope.tables = response;
									
									loadFields();
									for(var i = 0 ; i< $scope.tables.length; i++){
										$scope.tables[i].activeString = ($scope.tables[i].active) ? "Active" : "Inactive";
										for(var j = 0 ; j < $scope.groups.length ; j++){
											if($scope.tables[i].group == $scope.groups[j]._id){
												$scope.tables[i].groupName = $scope.groups[j].name;
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

			var showTable = function(number){
				
				return $scope.table[number].name


			}
			
			$scope.goToUpdateTable = function(table){
				$scope.model = {
					_id: table._id,
					name: table.name,
					group: table.group,
					active: table.active
				};
				
				if($scope.showCreateForm == false)
				{
					$scope.showCreateForm = true;
					$scope.searchShow = false;
					$state.go('app.table.update');
				}
			}

			$scope.updateTable = function(){
				if($scope.model.name == '' || $scope.model.name == null || $scope.model.group == '' || $scope.model.group == null){
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
			}

			$scope.createTable = function(){

				if($scope.model.name == '' || $scope.model.name == null || $scope.model.group == '' || $scope.model.group == null){
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
			}

		$scope.cancel = function(){
			$scope.model = {
				name: '',
				group: '',
				active: true
			};
			loadFields();
			$state.go('app.table',{}, {reload: true});
		}

		$scope.loadViewTable = function(table){
			$scope.searchShow = false;
			$scope.table = table;
			var params = {table: table._id, active: true};
			$scope.numbers = [1,2,3];
			$scope.results = [];
			$scope.aspectIndex = 0;
			$scope.categoryIndex = 0;
			$scope.aspects = [];
			$scope.categories = [];

			if($scope.showCreateForm == false)
			{
				$scope.showCreateForm = true;
			
			}
			$state.go('app.table.view');
			AspectServices.GetAspects(params).then(function(response){
				$scope.aspects = response;
				CategoryServices.GetCategories(params).then(function(response){
					$scope.categories = response;
					for(var i = 0; i<$scope.categories.length;i++){
						$scope.categories[i].cindex = i;
						$scope.results[i] = [];
						for(var j = 0;j< $scope.aspects.length;j++){
							$scope.aspects[j].aindex = j;
							$scope.results[i][j] = 1;
						}
					}
					$scope.reload();
				});
			});

		}

		$scope.reload = function(){
			$scope.searchShow = false;

			var dataset = [];
			for (var i = 0; i< $scope.categories.length ; i++)
			{
				dataset[i] = {
		 			label: $scope.categories[i].name,
					fillColor: "rgba(220,220,220,0)",
					strokeColor: color.mix[i],
					pointColor: color.mix[i],
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					scaleStepWidth : 3,
					scaleStartValue : 1,
					data: $scope.results[i]
				}
						
			}
				 			
			var label = [];
			for (var j = 0 ; j< $scope.aspects.length; j++){
				label.push($scope.aspects[j].name);
			}
			
			var data = {
				labels: label,
				datasets: dataset
			}
				

				
			var ctx = document.getElementById('chart').getContext("2d");

			var myLineChart = new Chart(ctx).Line(data, options);
			document.getElementById('legend').innerHTML = myLineChart.generateLegend();
		}
		

		$scope.submit = function(){
			
		}

	
		$scope.openFilter = function(){
			$scope.searchShow = true;
		}
		
		$scope.closeFilter = function(){
			$scope.searchShow = false;
		}

		$scope.clearFilter = function(){
			$scope.q = [];
		}
	}]);
})();