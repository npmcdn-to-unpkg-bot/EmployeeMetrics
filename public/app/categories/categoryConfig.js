var categoryApp = angular.module('categoryModule');


categoryApp.config(function($stateProvider){
	
	$stateProvider

		.state('app.category',{
			url: '/category',
			templateUrl	: 'app/categories/view/view.category.tmpl.html',
			controller 	: 'categoryController',
	
		})

		.state('app.category.create',{
			url: '/create',
			templateUrl	: 'app/categories/create/create.category.tmpl.html',
			controller 	: 'categoryController',

		})

		.state('app.category.update',{
			url: '/update/:id',
			templateUrl	: 'app/categories/update/update.category.tmpl.html',
			controller 	: 'categoryController'
		
			
		});
});