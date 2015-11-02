var employeeApp = angular.module('employeeModule');


employeeApp.config(function($stateProvider){
	
	$stateProvider

		.state('app.employee',{
			url: '/employee',
			templateUrl	: 'app/employees/view/view.employee.tmpl.html',
			controller 	: 'viewEmployeeController'
			
		})

		.state('app.employee.create',{
			url: '/employee/create',
			templateUrl	: 'app/employees/create/create.employee.tmpl.html',
			controller 	: 'createEmployeeController'
		})

		.state('app.employee.update',{
			url: '/employee/update/:id',
			templateUrl	: 'app/employees/update/update.employee.tmpl.html',
			controller 	: 'updateEmployeeController'
			
		});



});