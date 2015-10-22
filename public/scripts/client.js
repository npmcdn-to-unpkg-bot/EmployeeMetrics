'use strict';
var getMongoModule = angular.module('getData',[]);


//Creates the controllero for getMongo controller
getMongoModule.controller('getMongoController', function($scope, $http){
	//Here it will be stored all the information for people
	$scope.people= {};
	//Here it will be stored all the information about categories
	$scope.categories = {};
	//Here it will be stored all the relations between categories and people
	$scope.peopleCategories = {};
	//This is just a helper to be deleted when the app is ready
	$scope.helper={};

	//This decides which button will show
	$scope.ShowButton=false;


	//this functions gets all the people from the database
	$scope.getPeople = function(){
		$http.get('/employees').success(function(data){
			$scope.people = data;
		}).error(function(data){
			console.log("something really bad happened " + data);
		});		
	}

	//this function get all the categories from the data base
	$scope.getCategories = function(){
		$http.get('/categories').success(function(data){
			$scope.categories = data;
		}).error(function(data){
			console.log("something really bad happened " + data );
		});
	}

	//depending on the person selected it will show all the categories that person has been graded
	$scope.getPeopleCategories = function(idem){
		$http.get('/employees/'+idem, {params: {'employeeId': idem}})
		.success(function(data){
			//Checks if this person was already graded
			if (data.length == 0){
				$scope.ShowButton = true;
				for (var i=0;i<10; i++)
				{
					//Creates a new people categories and set the default data for that person
					$scope.peopleCategories[i] = {};
					$scope.peopleCategories[i].employeeId = idem;
					$scope.peopleCategories[i].categoryId = $scope.categories[i]._id;
					$scope.peopleCategories[i].name = $scope.getCategoryName($scope.peopleCategories[i].categoryId);
					$scope.peopleCategories[i].Results = [	1,	1,	1,	1 	];
					$scope.peopleCategories[i].total = 4;

				}
				
			}else{
				//gets all the information for that person
				$scope.ShowButton = false;
				$scope.peopleCategories = data;
				for (var i = 0; i<10; i++){
						$scope.peopleCategories[i].name = $scope.getCategoryName($scope.peopleCategories[i].categoryId);
						$scope.peopleCategories[i].total = parseInt($scope.peopleCategories[i].Results[0]) + 
									parseInt($scope.peopleCategories[i].Results[1]) + 
									parseInt($scope.peopleCategories[i].Results[2])+ 
									parseInt($scope.peopleCategories[i].Results[3]);
						
				}
		}
		}).error(function(data){
			//Checks if there was an error retrieving the data
			console.log("something really bad happened " + data);
		});
	}


	//Add new documents to the people-categories collection
	$scope.addToMongo = function(){
		$scope.showButton = false;
		//Sends all the categories
		for(var i = 0; i<10;i++){
			//Post the information stored in $scope.peoplecategories
			$http.post('/employees', $scope.peopleCategories[i]).success(function(data){
		
			}).error(function(data){
				//Sends an error if there was a problem in the post
				console.log("something really bad happened " + data);
				$scope.showButton = false;
			});
		}
		$scope.showButton = false;
	}

	//Update the documents in people catagories with the new data
	$scope.updateToMongo = function(){
		for(var i = 0; i<10;i++){
			//Update all the categories of the person selected by sending the most recent information 
			//stored in $scope.peopleCategories
			$http.post('/employees/' +  $scope.peopleCategories[i].employeeId		//URL to be send
				, $scope.peopleCategories[i], 										//Data sent to the post
				{params: {'employeeId': $scope.peopleCategories[i].employeeId}})	//Config and parameters sent to the post
			.error(function(data){
				//Sends an error if there was a proble in the post
				console.log("something really bad happened " + data);
				$scope.showButton = false;
			});
		}
		$scope.showButton = false;	
	}

	//On Index load this fucntion is called to and gets all the information from people and categories
	$scope.initialize = function(){
		$scope.getPeople();
		$scope.getCategories();
	}

	//This function triggers if any value of a specific row changes 
	$scope.resultChanged = function(rowNumber){
		$scope.peopleCategories[rowNumber].total = parseInt($scope.peopleCategories[rowNumber].Results[0]) + 
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
});