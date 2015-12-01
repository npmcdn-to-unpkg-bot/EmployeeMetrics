
var tableApp = angular.module('tableModule');


tableApp.config(function($stateProvider){
	
	$stateProvider

		.state('app.table',{
			url: '/table',
			templateUrl	: 'app/table/view/view.table.tmpl.html',
			controller 	: 'tableController',
	
		})

		.state('app.table.create',{
			url: '/create',
			templateUrl	: 'app/table/create/create.table.tmpl.html',
			controller 	: 'tableController',

		})

		.state('app.table.update',{
			url: '/update',
			templateUrl	: 'app/table/update/update.table.tmpl.html',
			controller 	: 'tableController'
		
			
		})
		.state('app.table.view',{
			url: '/view',
			templateUrl	: 'app/table/viewtable/viewtable.table.tmpl.html',
			controller 	: 'tableController'
		
			
		});
});