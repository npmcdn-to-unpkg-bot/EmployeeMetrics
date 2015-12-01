'use strict'

var employeeApp = angular.module('employeeModule');

employeeApp.controller('employeeController', ['$scope','$mdToast', '$stateParams','$state','EmployeeServices','GroupServices','AppServices' , 
			function($scope,$mdToast, $stateParams,$state, EmployeeServices,GroupServices, AppServices){
	
	$scope.employee = {};
	$scope.showCreateForm = false;

	$scope.accesslevels = [{
		'id' : 0,
		'name' : 'Employee'
	},
	{
		'id' : 1,
		'name' : 'Manager'
	},
	{
		'id' : 2,
		'name' : 'Administrator'
	}];

	$scope.groups= [];
	$scope.option = {

	};
	
	
	$scope.showCreate = function()
	{
		
		$scope.showCreateForm = true;
	}

	var showAccessLevel = function(number){
		
		return $scope.accesslevels[number].name
	}

	$scope.initialize = function(){
		$scope.model = {
			firstname: '',
			lastname: '',
			email: '',
			accesslevel : null,
			group: null,
			active : true
		};

		AppServices.GetAccess().then(function(data){
			switch(parseInt(data.access)){
				case 0:
				case 1:
					$state.go('logout');
					break;
				case 2:
					EmployeeServices.GetEmployees().then(function(response){
						$scope.employees = response;
						for (var i = 0 ; i < $scope.employees.length; i++){
							$scope.employees[i].accesslevelname = showAccessLevel($scope.employees[i].accesslevel);
						}
					});
					GroupServices.GetGroups().then(function(response){
						$scope.groups = response;
						$scope.fields = [
							{
								key: 'firstname',
								type: 'input',
								templateOptions: {
									label: 'First Name: ',
									placeholder: 'John'
								}
							},
							{
								key: 'lastname',
								type: 'input',
								templateOptions: {
									label: 'Last Name: ',
									placeholder: 'Doe'
								}
							},
							{
								key: 'email',
								type: 'input',
								templateOptions: {
									label: 'E-Mail: ',
									placeholder: 'John.Doe@synechron.com'
								}
							},
							{
								key: 'accesslevel',
								type: 'select',
								templateOptions: {
									label: 'Access Level: ',
									options: $scope.accesslevels,
									ngOptions: 'option.id as option.name for option in to.options'
								}
							},
							{
								key: 'group',
								type: 'select',
								templateOptions: {
									label: 'User Group: ',
									options: $scope.groups,
									ngOptions: 'option._id as option.name for option in to.options'	
								}

							},
							{
								key: 'active',
								type: 'checkbox',
								templateOptions: {
									label: 'Active',
									placeholder: 'Active'
								}
							}


						];
					});
					break;
			}
		});
	}

		


	$scope.saveEmployee = function(){
		
		var employee = $scope.employee;
		EmployeeServices.SaveEmployee(employee).then(function(response){
			$mdToast.show(
				$mdToast.simple()
				.content('Employee has been added successfully')
				.action('x')
				.highlightAction(false)
				.hideDelay(3000)
				.position("top right")
				.theme('success-toast')
			);
		
		
		$state.go('app.employee',	{}	,{	reload: true	});	
			
			
		});	
	}

	$scope.updateEmployee = function(){
		
		EmployeeServices.UpdateEmployee($scope.employee).then(function(response){
			$mdToast.show(
				$mdToast.simple()
				.content('Employee updated successfully')
				.action('x')
				.highlightAction(false)
				.hideDelay(3000)
				.position("top right")
				.theme('success-toast')
			);
			$state.go('app.employee',	{}	, {	reload: true });	
			
		});
	}

	$scope.changePassword = function(params){
		
		$state.go('app.forcepassword',{id: params});
	}

	$scope.cancel = function(){
		$state.go('app.employee',	{}	,{	reload: true	});	
	}

	$scope.goToUpdateEmployee = function(employee){
		console.log(employee);
		$scope.model = {
			firstname: 		employee.firstname,
			lastname: 		employee.lastname,
			email:			employee.email,
			accesslevel : 	employee.accesslevel,
			group:			employee.group,
			active : 		employee.active
		};
		console.log($scope.model);
		if($scope.showCreateForm == false)
		{
			$scope.showCreateForm = true;
			$state.go('app.employee.update');
						
		}
	}

}]);