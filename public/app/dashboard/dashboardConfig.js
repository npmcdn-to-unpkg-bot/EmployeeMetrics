
var dashboardModule = angular.module('dashboardModule');


dashboardModule.config(function($stateProvider, $urlRouterProvider){
	
	$stateProvider

		.state('app.dashboard',{
			url: '/dashboard',
			templateUrl	: 'app/dashboard/view/view.dashboard.tmpl.html',
			controller 	: 'viewDashboardController'
			
		});


});

