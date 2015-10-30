'use strict'
var myApp = angular.module('myApp');

myApp.factory('AppServices', AppServices);

function AppServices($http, $q , $window){
	
	var AppServices = {};

	var _login = function(data){
		var deferred = $q.defer(); 
		//Post the information stored in $scope.peoplecategories
		$http.post('/authenticate', data).success(function(data){
				deferred.resolve(data);
			}).error(function(data){
				deferred.resolve(data);
			});
		return deferred.promise;
		}
	
	var _validateToken = function(data){
		var deferred = $q.defer();
		$http.post('/validate', data).success(function(data){
				deferred.resolve(data);
			}).error(function(data){
				deferred.resolve(data);
			});
		return deferred.promise;
	}

	var _getAccess = function(data){
		var deferred = $q.defer();
		$http.get('/getaccess', {params: data}).success(function(data){
				deferred.resolve(data);
			}).error(function(data){
				deferred.resolve(data);
			});
		return deferred.promise;	
	}

	AppServices.Login = _login;
	AppServices.ValidateToken = _validateToken;
	AppServices.GetAccess = _getAccess;

	return AppServices;

}