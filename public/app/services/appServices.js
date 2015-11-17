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

	var _getAccess = function(){
		var deferred = $q.defer();
		$http.get('/getaccess').success(function(data){
				deferred.resolve(data);
			}).error(function(data){
				deferred.resolve(data);
			});
		return deferred.promise;	
	}

	var _changePassword = function(data){
		var deferred = $q.defer();
		$http.post('/password', data).success(function(data){
				deferred.resolve(data);
			}).error(function(data){
				deferred.resolve(data);
			});
		return deferred.promise;
	}

	var _logout = function(){
		var deferred = $q.defer();
		$http.post('/logout').success(function(data){
				deferred.resolve(data);
			}).error(function(data){
				deferred.resolve(data);
			});
		return deferred.promise;
	}

	AppServices.Login = _login;
	AppServices.GetAccess = _getAccess;
	AppServices.ChangePassword = _changePassword;
	AppServices.Logout 			= _logout;

	return AppServices;

}