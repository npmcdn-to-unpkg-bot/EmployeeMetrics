var groupApp = angular.module('groupModule');


groupApp.config(function($stateProvider){
	
	$stateProvider

		.state('app.group',{
			url: '/group',
			templateUrl	: 'app/groups/view/view.group.tmpl.html',
			controller 	: 'groupController',
		})

		.state('app.group.create',{
			url: '/create',
			templateUrl	: 'app/groups/create/create.group.tmpl.html',
			controller 	: 'groupController',
		})

		.state('app.group.update',{
			url: '/update',
			templateUrl	: 'app/groups/update/update.group.tmpl.html',
			controller 	: 'groupController'		
		});

});