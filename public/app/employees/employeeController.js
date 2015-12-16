'use strict'

var employeeApp = angular.module('employeeModule');

employeeApp.controller('employeeController', ['$scope','$mdToast', '$stateParams','$state','EmployeeServices','GroupServices','AppServices' , 
			function($scope,$mdToast, $stateParams,$state, EmployeeServices,GroupServices, AppServices){
	
	$scope.employee = {};
	$scope.showCreateForm = false;
	$scope.searchShow = false;
	

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
		$scope.searchShow = false;
	}

	var showAccessLevel = function(number){
		
		return $scope.accesslevels[number].name
	}

	var loadFields = function(isUpdate){
		$scope.fields = 
		[
			{
				key: 'firstname',
				type: 'horizontalInput',
				templateOptions: {
					label: 'First Name: ',
					placeholder: 'John',
					minlength: 3,
					required: true
				}
			},
			{
				key: 'lastname',
				type: 'horizontalInput',
				templateOptions: {
					label: 'Last Name: ',
					placeholder: 'Doe',
					minlength: 3,
					required: true
				}
			},
			{
				key: 'email',
				type: 'horizontalInput',
				templateOptions: {
					type: 'email',
					label: 'E-Mail: ',
					placeholder: 'John.Doe@synechron.com',
					required: true
				}
			},
			{
				key: 'password',
				type: 'horizontalInput',
				hide: isUpdate,
				templateOptions: {
					type: 'password',
					label: 'Password: ',
					placeholder: 'Password',
					minlength: 3,
					required: true
				}
			},
			{
				key: 'accesslevel',
				type: 'horizontalSelect',
				templateOptions: {
					label: 'Access Level: ',
					options: $scope.accesslevels,
					ngOptions: 'option.id as option.name for option in to.options',
					required: true
				}
			},
			{
				key: 'group',
				type: 'horizontalSelect',
				templateOptions: {
					label: 'User Group: ',
					options: $scope.groups,
					ngOptions: 'option._id as option.name for option in to.options'	,
					required: true
				}

			},
			{
				key: 'active',
				type: 'horizontalCheckbox',
				templateOptions: {
					label: 'Active',
					placeholder: 'Active'
				}
			}
		];

		$scope.filterFields = 
		[
			{
				key: 'firstname',
				type: 'horizontalInput',
				templateOptions: {
					label: 'First Name: ',
					placeholder: 'John',
				}
			},
			{
				key: 'lastname',
				type: 'horizontalInput',
				templateOptions: {
					label: 'Last Name: ',
					placeholder: 'Doe',
				}
			},
			{
				key: 'email',
				type: 'horizontalInput',
				templateOptions: {
					type: 'email',
					label: 'E-Mail: ',
					placeholder: 'John.Doe@synechron.com',
				}
			},
			{
				key: 'accesslevel',
				type: 'horizontalSelect',
				templateOptions: {
					label: 'Access Level: ',
					options: $scope.accesslevels,
					ngOptions: 'option.id as option.name for option in to.options',
					
				}
			},
			{
				key: 'group',
				type: 'horizontalSelect',
				templateOptions: {
					label: 'User Group: ',
					options: $scope.groups,
					ngOptions: 'option._id as option.name for option in to.options'	,
					
				}

			},
			{
				key: 'active',
				type: 'horizontalCheckbox',
				templateOptions: {
					label: 'Active',
					placeholder: 'Active'
				}
			}
		];
	}

	$scope.initialize = function(){
		console.log($scope.q);
		$scope.searchShow = false;
		$scope.model = {
			_id: '',
			firstname: '',
			lastname: '',
			email: '',
			accesslevel : 0,
			group: null,
			active : true,
			password: ''
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
						GroupServices.GetGroups().then(function(response){
							$scope.groups = response;
							
							loadFields(false);

							for(var i = 0 ; i< $scope.employees.length; i++){
								$scope.employees[i].activeString = $scope.employees[i].active ? "Active" : "Inactive";
								for(var j = 0; j< $scope.groups.length; j++){
									if ($scope.employees[i].group === $scope.groups[j]._id){
										$scope.employees[i].groupname = $scope.groups[j].name;
										break;
									}
								}
							}
						});
					});
					break;
			}
		});
	}

		


	$scope.saveEmployee = function(){
		
		var employee = $scope.model;

		if($scope.model.firstname == '' || $scope.model.firstname == null ||
		   $scope.model.lastname  == '' || $scope.model.lastname  == null ||
		   $scope.model.email     == '' || $scope.model.email     == null ||
		   $scope.model.group     == '' || $scope.model.group     == null ||
		   $scope.model.password  == '' || $scope.model.password  == null){
			$mdToast.show(
				$mdToast.simple()
				.content('It cannot be a required field empty')
				.action('x')
				.highlightAction(false)
				.hideDelay(3000)
				.position("top right")
				.theme('error-toast')
			);	
		}else{

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
	}

	$scope.updateEmployee = function(){

		if($scope.model.firstname == '' || $scope.model.firstname == null ||
		   $scope.model.lastname  == '' || $scope.model.lastname  == null ||
		   $scope.model.email     == '' || $scope.model.email     == null ||
		   $scope.model.group     == '' || $scope.model.group     == null){
			$mdToast.show(
				$mdToast.simple()
				.content('It cannot be a required field empty')
				.action('x')
				.highlightAction(false)
				.hideDelay(3000)
				.position("top right")
				.theme('error-toast')
			);	
		}else{

			EmployeeServices.UpdateEmployee($scope.model).then(function(response){
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
	}

	$scope.changePassword = function(params){
		
		$state.go('app.forcepassword',{id: params});
	}

	$scope.cancel = function(){
		//console.log(this);
		console.log(this.$parent.theFormlyForm);
		loadFields();
		$scope.model = {
			_id: '',
			firstname: '',
			lastname: '',
			email: '',
			accesslevel : null,
			group: null,
			active : true,
			password: ''
		};

		$state.go('app.employee',	{}	,{	reload: true	});	
	}

	$scope.goToUpdateEmployee = function(employee){
		$scope.searchShow = false;
		loadFields(true);
		$scope.model = {
			_id			: 	employee._id,
			firstname	:	employee.firstname,
			lastname	:	employee.lastname,
			email 		:	employee.email,
			accesslevel : 	employee.accesslevel,
			group 		:	employee.group,
			active 		:	employee.active,
			password 	:	employee.password
		};
		
		if($scope.showCreateForm == false)
		{
			$scope.searchShow = false;
			$scope.showCreateForm = true;
			$state.go('app.employee.update');
		}
	}

	$scope.clearFilter = function(){
		$scope.q = [];
	}

	$scope.openFilter = function(){
		$scope.searchShow = true;
	}
	$scope.closeFilter = function(){
		$scope.searchShow = false;
	}
}]);