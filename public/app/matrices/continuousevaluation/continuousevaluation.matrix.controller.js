'use strict';
var competitionMatricesModule = angular.module('competitionMatrices');


//Creates the controllero for getMongo controller
competitionMatricesModule.controller('continuousEvaluationMatrixController', 	['$scope', '$mdToast','$state', '$window','$filter', 'CompetitionMatrixServices','AppServices', 'EmployeeServices','ManagerServices', 	function($scope, $mdToast, $state, $window, $filter, CompetitionMatrixServices, AppServices, EmployeeServices, ManagerServices){

	//Here it will be stored all the information for people
	$scope.people= {};
	//Here it will be stored all the information about categories
	$scope.categories = {};
	//Here it will be stored all the relations between categories and people
	$scope.peopleCategories = {};
	
	//This variable will store only the parameters date and employeeId
	$scope.params = {};
	$scope.ratings = [1,2,3];
	//This decides which button will show
	$scope.ShowButton=false;

	$scope.date = {};

	$scope.select = {};
	$scope.select.year = [];
	$scope.select.month = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];

	
	//depending on the person selected it will show all the categories that person has been graded
	$scope.getPeopleCategories = function(params){
				
		var month = moment().month($scope.date.month);
		params.date = moment({y: $scope.date.year, M: month.month(), d: 15}).toISOString();

		$scope.params = params;

		$scope.params.table = $scope.categories[0].table;
		
		
		CompetitionMatrixServices.GetPeopleCategories($scope.params).then(function(data){

			
			if (data.length == 0){
				$scope.ShowButton = true;
				for (var i=0;i<$scope.categories.length; i++)
				{
					//Creates a new people categories and set the default data for that person
					$scope.peopleCategories[i] = {};
					$scope.peopleCategories[i].employeeId = params.employeeId;
					$scope.peopleCategories[i].categoryId = $scope.categories[i]._id;		
					$scope.peopleCategories[i].Results = [];
					$scope.resultChanged(i);
					
				}
			}else{
				//gets all the information for that person
				$scope.ShowButton = false;
				$scope.peopleCategories = data;
				
				for (var i = 0; i < $scope.peopleCategories.length; i++){
					
					$scope.resultChanged(i);
						
				}
			}
		});
		
	}

	//Add new documents to the people-categories collection
	$scope.addToMongo = function(){
		var success = true;
		$scope.ShowButton = false;
		var month = moment().month($scope.date.month);
		var params = {};
		params.date = moment({y: $scope.date.year, M: month.month(), d: 15}).toISOString();
		$scope.params = params;
		//Sends all the categories
		for(var i = 0; i<$scope.categories.length;i++){
			//Post the information stored in $scope.peoplecategories
			$scope.peopleCategories[i].date = $scope.params.date;
			$scope.peopleCategories[i].table = $scope.categories[i].table;
			
			CompetitionMatrixServices.AddToMongo($scope.peopleCategories[i]).then(function(data){
				if(data.error == true){
					success = false;
				}
			});
		}
		if(success){
			$scope.peopleCategories = {};
			$mdToast.show(
				$mdToast.simple()
				.content('Data has been added successfully')
				.action('x')
				.highlightAction(false)
				.hideDelay(3000)
				.position("top right")
				.theme('success-toast')
			);
		}
		//$state.go('app.continuous-evaluation');
	}

	//Update the documents in people catagories with the new data
	$scope.updateToMongo = function(){
		$scope.ShowButton = false;	
		var success = true;
		var month = moment().month($scope.date.month);
		var params = {};
		params.date = moment({y: $scope.date.year, M: month.month(), d: 15 }).toISOString();
		$scope.params = params;
		for(var i = 0; i<$scope.peopleCategories.length;i++){
			
			//Update all the categories of the person selected by sending the most recent information 
			//stored in $scope.peopleCategories
			CompetitionMatrixServices.UpdateToMongo($scope.peopleCategories[i]).then(function(data){
				if(data.error){
					success = false;
				}
			});
		}
		if(success){
			$scope.peopleCategories = {};
			$mdToast.show(
				$mdToast.simple()
				.content('Data updated successfully')
				.action('x')
				.highlightAction(false)
				.hideDelay(3000)
				.position("top right")
				.theme('success-toast')
			);
		}
		//$state.go('app.continuous-evaluation');
	};

	function findPerson(employeesFromManager,i){
		EmployeeServices.GetEmployee(employeesFromManager[i]).then(function(response){
			$scope.people[i] = response[0];
			
		});
	}
	//On Index load this fucntion is called to and gets all the information from people and categories
	$scope.initialize = function(){
		
		$scope.categories = {};
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
				default:
					$state.go('logout');
					break;
					
			}
		});


		var params = {};
		params.table = 2;
		CompetitionMatrixServices.GetMatrix(params).then(function(response){
			$scope.categories = response;
		});

	}

	//This function triggers if any value of a specific row changes 
	$scope.resultChanged = function(rowNumber){

		$scope.peopleCategories[rowNumber].total= parseInt($scope.peopleCategories[rowNumber].Results[0]) + //make this a function and take out the hard coding in the indexes
							parseInt($scope.peopleCategories[rowNumber].Results[1]) + 
							parseInt($scope.peopleCategories[rowNumber].Results[2]) + 
							parseInt($scope.peopleCategories[rowNumber].Results[3]);

	}


	//This function is to get the correct name for the categories
	//This function is not being used
	$scope.getCategoryName = function(id){
		
		for (var i = 0; i<$scope.categories.length;i++)
		{
			if(id == $scope.categories[i]._id)
				return $scope.categories[i].name;
		}
	}

	$scope.setFalse=function(){
		$scope.success = false;
	}
}]);



