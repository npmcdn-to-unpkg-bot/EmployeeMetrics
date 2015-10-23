var getMongoModule = angular.module('getData');

getMongoModule.factory('MongoModules', MongoModuleServicesFactory);

function MongoModuleServicesFactory($http, $q){
	
	var MongoModuleServicesFactory = {};

	var _getPeople = function(){
		var deferred = $q.defer(); 
		$http.get('/employees').success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;
	}

	var _getCategories = function(){
		var deferred = $q.defer(); 
		$http.get('/categories').success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	}

	var _getPeopleCategories = function(params){		
		var deferred = $q.defer(); 
		$http.get('/employees/'+params.employeeId, {params: params})
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
		$http.post('/employees', data).success(function(data){
				deferred.resolve(data);
			}).error(function(data){
				deferred.resolve(data);
			});
		return deferred.promise;
		}
	

	var _updateToMongo = function(data){
		var deferred = $q.defer(); 
		$http.post('/employees/' + data.employeeId		//URL to be send
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

	MongoModuleServicesFactory.GetPeople 			= _getPeople;
	MongoModuleServicesFactory.GetCategories  		= _getCategories;
	MongoModuleServicesFactory.GetPeopleCategories 	= _getPeopleCategories;
	MongoModuleServicesFactory.AddToMongo 			= _addToMongo;
	MongoModuleServicesFactory.UpdateToMongo 		= _updateToMongo;
	return MongoModuleServicesFactory;

}