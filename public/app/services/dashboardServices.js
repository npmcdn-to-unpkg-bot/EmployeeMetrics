'use strict'
var dashboardModule = angular.module('dashboardModule');

dashboardModule.factory('DashboardServices', DashboardServices);

function DashboardServices($http, $q){
	
	var DashboardServices = {};

		var _getDashboard = function(params){
		var deferred = $q.defer(); 
		
		$http.get('/dashboard',{params:params}).success(function(data){
			deferred.resolve(data);
		}).error(function(data){
			deferred.resolve(data);
		});		
		return deferred.promise;
	}

	
	DashboardServices.GetDashboard    = _getDashboard;
	return DashboardServices;

}