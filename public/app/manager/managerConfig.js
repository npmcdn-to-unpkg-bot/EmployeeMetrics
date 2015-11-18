'use strict'
var managerModule = angular.module('managerModule');

managerModule.config(function($stateProvider){
	$stateProvider
		.state('app.manager',{
			url: '/manager',
			templateUrl: 'app/manager/view/view.manager.tmpl.html',
			controller: 'viewManagerController'
		})

		.state('app.manager-edit',{
			url: '/edit/:id',
			templateUrl: 'app/manager/edit/edit.manager.tmpl.html',
			controller: 'editManagerController'
		})

		.state('app.manager-edit.add',{
			url: '/add/:id',
			templateUrl: 'app/manager/add/add.manager.tmpl.html',
			controller: 'addManagerController'
		});

});