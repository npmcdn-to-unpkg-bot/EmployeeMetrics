(function(){
	'use strict'
	var matrixApp = angular.module('competitionMatrices');

	matrixApp.controller('competitionMatricesController', ['$scope', '$stateParams', '$state','$mdToast', 'TableServices','AppServices','GroupServices', 'CategoryServices', 'AspectServices',
						function($scope, $stateParams, $state,$mdToast , TableServices, AppServices, GroupServices, CategoryServices, AspectServices){
			$scope.table = {};
			$scope.showCreateForm = false;
			
			$scope.option = {

			};

			$scope.numbers = [1,2,3];
			$scope.results = [];
			$scope.aspectIndex = 0;
			$scope.categoryIndex = 0;
			$scope.aspects = [];
			$scope.categories = [];
			$scope.date = {};
			$scope.select = {};
			$scope.select.year = [];
			$scope.select.month = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];

			$scope.people = {};

			$scope.initialize = function(){
				
				$scope.people = {};

				for(var i=0;i<=50;i++){
					$scope.select.year[i]=2000+i;
				}

				//this operations are to set a default date
				var today = new Date();
				var month = moment(today).month();
				var year = moment(today).year();
				
				$scope.date.month = $scope.select.month[month];
				$scope.date.year = year;

				AppServices.GetAccess().then(function(data){
					
					$scope.table = $stateParams.id;					
					var params = {id: $scope.table};
					TableServices.GetTable(params).then(function(response){
						$scope.table = response;
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
						params = {table: response._id, active: true};
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
							});
						});
					});
					switch(parseInt(data.access)){
						case 0:
							EmployeeServices.GetEmployee().then(function(response){
								$scope.people[0] = response;
							});
							break;
						case 1:
							ManagerServices.GetEmployeeUnderManger().then(function(response){
								for (var i = 0; i<response.length;i++){
									findPerson(response,i);
								}
							});

							EmployeeServices.GetEmployee().then(function(response){
									$scope.people[$scope.people.length] = response;
							});
							break;
						case 2:
							$state.go('logout');
							break;
					}
				});

			}

			
	}]);

})();