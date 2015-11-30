var aspectApp = angular.module('aspectModule');


aspectApp.config(function($stateProvider){
	
	$stateProvider

		.state('app.aspect',{
			url: '/aspect',
			templateUrl	: 'app/aspects/view/view.aspect.tmpl.html',
			controller 	: 'aspectController',
	
		})

		.state('app.aspect.create',{
			url: '/create',
			templateUrl	: 'app/aspects/create/create.aspect.tmpl.html',
			controller 	: 'aspectController',

		})

		.state('app.aspect.update',{
			url: '/update/:id',
			templateUrl	: 'app/aspects/update/update.aspect.tmpl.html',
			controller 	: 'aspectController'
		
			
		});
});