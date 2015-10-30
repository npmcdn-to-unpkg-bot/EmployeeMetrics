var myApp = angular.module('myApp');


myApp.config(function($stateProvider, $urlRouterProvider){
	
	$stateProvider

		.state('login',{
			url: '/login',
			templateUrl	: 'app/auth/login/auth.login.tmpl.html',
			controller 	: 'authLoginController'
			
		})

		.state('logout',{
			url: '/logout',
			templateUrl: 'app/auth/logout/auth.logout.tmpl.html',
			controller : 'authLogoutController' 
		})

		.state('app', {
			url: '/app',
			templateUrl	: 'app/auth/app.tmpl.html',
			controller 	: 'appController'
			
			
		});

		$urlRouterProvider.when('', 'login');



});