var employeeApp = angular.module('employeeModule');


employeeApp.config(function($stateProvider){
	
	$stateProvider

		.state('employee',{
			url: '/employee',
			templateUrl	: 'app/employees/view/view.employee.tmpl.html',
			controller 	: 'viewEmployeeController'
			
		})

		.state('employee.create',{
			url: '/create',
			templateUrl	: 'app/employees/create/create.employee.tmpl.html',
			controller 	: 'createEmployeeController'
		})

		.state('employee.update',{
			url: '/update/:id',
			templateUrl	: 'app/employees/update/update.employee.tmpl.html',
			controller 	: 'updateEmployeeController'
			
		});



});