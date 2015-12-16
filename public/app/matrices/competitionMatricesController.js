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

			$scope.isDataLoaded = false;
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


				
				AppServices.GetAccess().then(function(data){
					switch(parseInt(data.access)){
						case 0:
							EmployeeServices.GetEmployee().then(function(response){
								$scope.people[0] = response;
								var today = new Date();
								var month = moment(today).month();
								var year = moment(today).year();
								
								var params = {id : $stateParams.id};
								$scope.params.employeeId = response._id;
								$scope.date.numberMonth = month;
								$scope.date.month = $scope.select.month[month];;
								$scope.date.year = year;

								getMatrix(params);
								
							});
							
							break;
						case 1:
							ManagerServices.GetEmployeeUnderManger().then(function(response){
								for (var i = 0; i<response.length;i++){
									findPerson(response,i);
								}
								var index = response.length;
								

								EmployeeServices.GetEmployee().then(function(response){
										$scope.people[index] = response;
										var today = new Date();
										var month = moment(today).month();
										var year = moment(today).year();
										var params = {id : $stateParams.id};
										/*var params = {
											tableId: $scope.table._id,
											date: moment({y: $scope.date.year, M: month, d: 15}).toISOString(),
											employeeId: response._id,
										};*/
										$scope.params.employeeId = $scope.people[index]._id;
										$scope.date.numberMonth = month;
										$scope.date.month = $scope.select.month[month];;
										$scope.date.year = year;
										getMatrix(params);
								});
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
			tableId: $stateParams.id,
			date: 	moment({y: $scope.date.year, M: month.month(), d: 15}).toISOString(),
			employeeId: pEmployeeId
		};
		
		
		CompetitionMatrixServices.GetPeopleCategories(params).then(function(response){
			if (response.length!=0){
				var h = 0;
				var k = 0;
				$scope.ShowButton = false;
				
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
						$scope.peopleCategories[i][j].tableId	 = $stateParams.id;
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
		params = {id: params.tableId};
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

			params = {table: $stateParams.id, active: true};
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
							$scope.peopleCategories[i][j].tableId	 = $stateParams.id;
							$scope.peopleCategories[i][j].categoryId = $scope.categories[i]._id;
							$scope.peopleCategories[i][j].aspectId 	 = $scope.aspects[j]._id;
							$scope.peopleCategories[i][j].Results 	 = 1;
						}
					}
					for(var i = 0; i<$scope.categories.length;i++){
						$scope.resultChanged(i);
					}
					$scope.isDataLoaded = true;
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
				
				
				$scope.peopleCategories[i][j].employeeId = $scope.params.employeeId;
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


	//this function is to test if the category or aspect is in array
	function isInArray(array, element){
		//if the array is more than 0
		if(array.length > 0){
			var inArray = false;
			//go through the array
			for(var i=0 ; i< array.length; i++){
				//if it has at least one element equal another
				if(array[i]._id == element._id){
					//sets in array to true
					inArray = true;
					break;
				}
			}
			//if the element is not in the array
			if(inArray == false){
				//add the element to the array
				array.push(element);
			}
		}else{
			//if it is the first element added directly to the array
			array.push(element);
		}

	}


	function getMatrix(params){
		//Get the table requested through URL
		
		TableServices.GetTable(params).then(function(response){
			$scope.table = response;
			var params = {table : $stateParams.id};
			CategoryServices.GetCategories(params).then(function(response){
				
				$scope.categories = response;
				for(var i = 0;i< $scope.categories.length; i++){
					$scope.categories[i].cindex = i;
				}

				var params = {table : $stateParams.id};
				AspectServices.GetAspects(params).then(function(response){

					$scope.aspects = response;
					for(var i = 0;i< $scope.aspects.length; i++){
						$scope.aspects[i].aindex = i;
					}

					params = {
						tableId: $stateParams.id,
						date: moment({y: $scope.date.year, M: $scope.date.numberMonth, d: 15}).toISOString(),
						employeeId: response._id,
					};					
					
					//Get People categories to start building the matrix from there		
					CompetitionMatrixServices.GetPeopleCategories(params).then(function(response){
						
						if (response.length != 0){
							
							var hasCategory = [];
							var hasAspect = [];
							for(var i = 0; i< response.length;i++){

								for(var j = 0 ; j< $scope.categories.length;j++){
									if(response[i].categoryId == $scope.categories[j]._id){
										isInArray(hasCategory, $scope.categories[j]);
										break;
									}
								}
								for(var j = 0;j< $scope.aspects.length;j++){
									if(response[i].aspectId == $scope.aspects[j]._id){
										isInArray(hasAspect, $scope.aspects[j]);
										break;
									}
								}

							}

							$scope.categories = hasCategory;
							$scope.aspects = hasAspect;

							$scope.peopleCategories = [];
							for (var j = 0 ; j< $scope.categories.length; j++){
								$scope.peopleCategories[j] = [];
							}

							$scope.ShowButton = false;
							
							var h = 0;
							var k = 0;
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
							$scope.isDataLoaded = true;
						}else{
							$scope.ShowButton = true;

							getEmptyMatrix(params);
						}

					});	
				});			
			});
			
		});
	}
			
	}]);

})();