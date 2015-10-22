'use strict';
var getMongoModule = angular.module('getData');


//Creates the controllero for getMongo controller
getMongoModule.controller('getMongoController', ['$scope', '$filter', 'MongoModules', function($scope, $filter,MongoModules){

	//Here it will be stored all the information for people
	$scope.people= {};
	//Here it will be stored all the information about categories
	$scope.categories = {};
	//Here it will be stored all the relations between categories and people
	$scope.peopleCategories = {};
	
	//This decides which button will show
	$scope.ShowButton=false;

	//depending on the person selected it will show all the categories that person has been graded
	$scope.getPeopleCategories = function(idem){	
		MongoModules.GetPeopleCategories(idem).then(function(data){
			if (data.length == 0){
				$scope.ShowButton = true;
				for (var i=0;i<10; i++)
				{
					//Creates a new people categories and set the default data for that person
					$scope.peopleCategories[i] = {};
					$scope.peopleCategories[i].employeeId = idem;
					$scope.peopleCategories[i].categoryId = $scope.categories[i]._id;
					$scope.peopleCategories[i].name = $scope.getCategoryName($scope.peopleCategories[i].categoryId);
					/*var date = new Date().toISOString();
					$scope.peopleCategories[i].date = new Date(date.getFullYear(), date.getMonth(), date.getDay());*/
					$scope.peopleCategories[i].Results = [	1,	1,	1,	1 	];
					$scope.peopleCategories[i].total = 4;

				}
			}else{
				//gets all the information for that person
				$scope.ShowButton = false;
				$scope.peopleCategories = data;
				for (var i = 0; i<10; i++){
					$scope.peopleCategories[i].name = $scope.getCategoryName($scope.peopleCategories[i].categoryId);

					$scope.peopleCategories[i].total = $scope.resultChanged(i);
					var date = $scope.peopleCategories.date;
					$scope.peopleCategories.date = $filter('date')(date, 'MM-dd-YYYY');
						
				}
			}
		});
	}

	//Add new documents to the people-categories collection
	$scope.addToMongo = function(){
		$scope.ShowButton = false;
		//Sends all the categories
		for(var i = 0; i<10;i++){
			//Post the information stored in $scope.peoplecategories
			MongoModules.AddToMongo($scope.peopleCategories[i]).then(function(data){
				console.log('Data Added');
			});
		}
		
	}

	//Update the documents in people catagories with the new data
	$scope.updateToMongo = function(){
		for(var i = 0; i<10;i++){
	
			//Update all the categories of the person selected by sending the most recent information 
			//stored in $scope.peopleCategories
			MongoModules.UpdateToMongo($scope.peopleCategories[i]).then(function(data){
				console.log('Data Updated');

			});
		}
		$scope.ShowButton = false;	
	}

	//On Index load this fucntion is called to and gets all the information from people and categories
	$scope.initialize = function(){
		MongoModules.GetPeople().then(function(response){
			$scope.people = response;
		});
		MongoModules.GetCategories().then(function(response){
			$scope.categories = response;
		});
		
	}

	//This function triggers if any value of a specific row changes 
	$scope.resultChanged = function(rowNumber){
		return parseInt($scope.peopleCategories[rowNumber].Results[0]) + //make this a function and take out the hard coding in the indexes
							parseInt($scope.peopleCategories[rowNumber].Results[1]) + 
							parseInt($scope.peopleCategories[rowNumber].Results[2]) + 
							parseInt($scope.peopleCategories[rowNumber].Results[3]);
	}



	//This function is to get the correct name for the categories
	$scope.getCategoryName = function(id){
		for (var i = 0; i<$scope.categories.length;i++)
		{
			if(id == $scope.categories[i]._id)
				return $scope.categories[i].name;
		}
	}
}]);


//All http call make a factory and call the factory
//use vm instead of scope
//use toasts instead of console log in errors (optional)
//Services capitalized
//Use deferred on the http calls $q

//Add to the top matrices competition
//take the update to the side if the rows are too many
//add button allow us to add a new category for that person