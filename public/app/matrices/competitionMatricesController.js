(function(){
	'use strict'
	var matrixApp = angular.module('competitionMatrices');

	matrixApp.controller('competitionMatricesController', ['$scope', '$stateParams', '$state','$mdToast','EmployeeServices', 'TableServices','AppServices','GroupServices', 'CategoryServices', 'AspectServices','CompetitionMatrixServices', 'ManagerServices',
						function($scope, $stateParams, $state,$mdToast ,EmployeeServices, TableServices, AppServices, GroupServices, CategoryServices, AspectServices, CompetitionMatrixServices, ManagerServices){
			$scope.table = {};
			$scope.showCreateForm = false;
			$scope.ShowButton=false;
			$scope.option = {

			};
			$scope.params = {};

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

				if($stateParams.id==null || $stateParams.id ==''){
					$state.go('app.dashboard');
				}
				var params = {id: $stateParams.id}
				//getEmptyMatrix(params);
				TableServices.GetTable(params).then(function(response){
					$scope.table = response;
					$scope.numbers = [1,2,3];
					$scope.peopleCategories = [];
					$scope.aspectIndex = 0;
					$scope.categoryIndex = 0;
					$scope.aspects = [];
					$scope.categories = [];
					params = {table: response._id, active: true};
					AspectServices.GetAspects(params).then(function(response){
						$scope.aspects = response;
						CategoryServices.GetCategories(params).then(function(response){
							$scope.categories = response;

							for(var i = 0; i<$scope.categories.length;i++){
								$scope.categories[i].cindex = i;
								$scope.peopleCategories[i] = [];
								for(var j = 0;j< $scope.aspects.length;j++){
									$scope.aspects[j].aindex = j;
									$scope.peopleCategories[i][j] = {};
								}
							}
							

						});
					});			
				});

				//this operations are to set a default date
				var today = new Date();
				var month = moment(today).month();
				var year = moment(today).year();
				
				
				$scope.date.month = $scope.select.month[month];
				$scope.date.year = year;

				AppServices.GetAccess().then(function(data){
					
									
					
					switch(parseInt(data.access)){
						case 0:
							EmployeeServices.GetEmployee().then(function(response){
								$scope.people[0] = response;
								var today = new Date();
								var month = moment(today).month();
								var year = moment(today).year();
								var params = {
									tableId: $scope.table._id,
									date: moment({y: $scope.date.year, M: month, d: 15}).toISOString(),
									employeeId: response._id,
								};

								$scope.params.employeeId = params.employeeId;
								
								$scope.getPeopleCategories(params);
										
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
									var today = new Date();
									var month = moment(today).month();
									var year = moment(today).year();
									var params = {
										tableId: $scope.table._id,
										date: moment({y: $scope.date.year, M: month, d: 15}).toISOString(),
										employeeId: response._id,
									};
									$scope.params.employeeId = response._id;
									$scope.getPeopleCategories(params);
							});
							break;
						case 2:
							$state.go('logout');
							break;
					}
				});

			}

	//This function triggers if any value of a specific row changes 
	$scope.resultChanged = function(rowNumber){
		$scope.peopleCategories[rowNumber].total = 0;	
		for (var i = 0; i< $scope.peopleCategories[rowNumber].length; i++){
			$scope.peopleCategories[rowNumber].total += parseInt($scope.peopleCategories[rowNumber][i].Results);	
		}
	}

	$scope.getPeopleCategories = function(params){
		var pEmployeeId = params.employeeId;
		var month = moment().month($scope.date.month);
		
		params = {
			tableId: $scope.table._id,
			date: 	moment({y: $scope.date.year, M: month.month(), d: 15}).toISOString(),
			employeeId: pEmployeeId,
		};
		console.log($scope.peopleCategories);
		
		CompetitionMatrixServices.GetPeopleCategories(params).then(function(response){
			if (response.length!=0){
				var h = 0;
				var k = 0;
				$scope.ShowButton = false;
				console.log(response);
				for (var i = 1; i<= response.length; i++){
					
					$scope.peopleCategories[h][k] = response[i-1];
					if(i % $scope.aspects.length == 0 && i != 0)
					{ 
						h++;
						k=0;
					}else{
						k++;
					}
				}

				for(var i = 0;i<$scope.peopleCategories.length;i++){
					$scope.resultChanged(i);
				}
				
			}else{
				$scope.ShowButton = true;
				for(var i = 0; i<$scope.categories.length;i++){
					$scope.categories[i].cindex = i;
					$scope.peopleCategories[i] = [];
					for(var j = 0;j< $scope.aspects.length;j++){
						$scope.aspects[j].aindex = j;
						$scope.peopleCategories[i][j] = {};
						$scope.peopleCategories[i][j].tableId	 = $scope.table._id;
						$scope.peopleCategories[i][j].categoryId = $scope.categories[i]._id;
						$scope.peopleCategories[i][j].aspectId 	 = $scope.aspects[j]._id;
						$scope.peopleCategories[i][j].Results 	 = 1;
					}
				}
				for(var i = 0; i<$scope.categories.length;i++){
					$scope.resultChanged(i);
				}
			}

		});
	}

	function findPerson(employeesFromManager,i){
		EmployeeServices.GetEmployee(employeesFromManager[i]).then(function(response){
			$scope.people[i] = response[0];
			
		});
	}

	function getEmptyMatrix(params){
		TableServices.GetTable(params).then(function(response){
			$scope.table = response;
			$scope.numbers = [1,2,3];
			$scope.peopleCategories = [];
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
						$scope.peopleCategories[i] = [];
						for(var j = 0;j< $scope.aspects.length;j++){
							$scope.aspects[j].aindex = j;
							$scope.peopleCategories[i][j] = {};
							$scope.peopleCategories[i][j].tableId	 = $scope.table._id;
							$scope.peopleCategories[i][j].categoryId = $scope.categories[i]._id;
							$scope.peopleCategories[i][j].aspectId 	 = $scope.aspects[j]._id;
							$scope.peopleCategories[i][j].Results 	 = 1;
						}
					}
					for(var i = 0; i<$scope.categories.length;i++){
						$scope.resultChanged(i);
					}
				});
			});
		});
	}

	$scope.createPeopleCategories = function(){
		var month = moment().month($scope.date.month);
		var params = {};
		params.date = moment({y: $scope.date.year, M: month.month(), d: 15}).toISOString();


		for(var i = 0; i<$scope.categories.length;i++){
			
			
			for(var j = 0;j< $scope.aspects.length;j++){
				
				
				$scope.peopleCategories[i][j].employeeId = $scope.people[0]._id;
				$scope.peopleCategories[i][j].date = params.date;
				
			}
		}
		
		CompetitionMatrixServices.AddToMongo($scope.peopleCategories).then(function(response){
			//mdtoast and all that
			$mdToast.show(
				$mdToast.simple()
				.content('Data has been added successfully')
				.action('x')
				.highlightAction(false)
				.hideDelay(3000)
				.position("top right")
				.theme('success-toast')
			);
			$scope.ShowButton = false;
		});
	}

	$scope.updatePeopleCategories = function(){
		CompetitionMatrixServices.UpdateToMongo($scope.peopleCategories).then(function(response){
			//mdtoast and all that
			$scope.ShowButton = false;
			$mdToast.show(
				$mdToast.simple()
				.content('Data has been updated successfully')
				.action('x')
				.highlightAction(false)
				.hideDelay(3000)
				.position("top right")
				.theme('success-toast')

			);
		});
	}

	//this function is for testing purposes
	$scope.submit = function(){

		
	}
			
	}]);

})();