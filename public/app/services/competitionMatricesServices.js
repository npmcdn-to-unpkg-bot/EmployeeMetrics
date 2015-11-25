'use strict'
var competitionMatricesModule = angular.module('competitionMatrices');

competitionMatricesModule.factory('CompetitionMatrixServices', CompetitionMatricesServices);

function CompetitionMatricesServices($http, $q){
	
	var CompetitionMatricesServices = {};

	var _getPeople = function(){
		var deferred = $q.defer(); 
		$http.get('/employees').success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;
	}

	var _getMatrix = function(params){
		var deferred = $q.defer();
		$http.get('/categories', {params: params}).success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	}

	var _getPeopleCategories = function(params){		
		var deferred = $q.defer(); 
		$http.get('/matrix', {params: params})
		.success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	}

	var _addToMongo = function(data){
		var deferred = $q.defer(); 
		//Post the information stored in $scope.peoplecategories
		$http.post('/matrix', data).success(function(data){
				deferred.resolve(data);
			}).error(function(data){
				deferred.resolve(data);
			});
		return deferred.promise;
		}
	

	var _updateToMongo = function(data){
		var deferred = $q.defer(); 
		$http.put('/matrix'		//URL to be send
				, data, 				//Data sent to the post
				{params: data.employeeId})	//Config and parameters sent to the post
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(data){
				deferred.resolve(data);
				
			});
		return deferred.promise;
	}


	CompetitionMatricesServices.GetPeople 							= _getPeople;
	CompetitionMatricesServices.GetMatrix 							= _getMatrix;
	CompetitionMatricesServices.GetPeopleCategories 				= _getPeopleCategories;
	CompetitionMatricesServices.AddToMongo 							= _addToMongo;
	CompetitionMatricesServices.UpdateToMongo 						= _updateToMongo;
	return CompetitionMatricesServices;

}