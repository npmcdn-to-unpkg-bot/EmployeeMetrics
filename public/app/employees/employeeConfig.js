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
			templateUrl	: 'app/matrices/continuousevaluation/continuousevaluation.matrix.tmpl.html',
			controller 	: 'createEmployeeController'
		})

		.state('employee.update',{
			url: '/update',
			templateUrl	: 'app/employee/view/view.employee.tmpl.html',
			controller 	: 'updateEmployeeController'
		})



});