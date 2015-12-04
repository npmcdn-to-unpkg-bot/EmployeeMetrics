'use strict'
var dashboardModule = angular.module('dashboardModule');


competitionMatricesModule.controller('viewDashboardController', 
	['$scope','$state', '$filter', 'CompetitionMatrixServices','AppServices', 'CategoryServices' ,'EmployeeServices','ManagerServices', 'DashboardServices', 'AspectServices', 'TableServices', 'GroupServices',
	function($scope, $state, $filter, CompetitionMatrixServices, AppServices,  CategoryServices , EmployeeServices, ManagerServices, DashboardServices, AspectServices, TableServices, GroupServices){ 
		$scope.employee = {};
		
		$scope.userChart = {};
		$scope.managerChart = {};


		$scope.peopleCategories = [];
		
		$scope.totals = {};

		

		$scope.date = {};


		$scope.select = {};
		$scope.select.month = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];
		$scope.select.year = [];

		$scope.isAdmin = false;
		$scope.isManager = false;
		$scope.hasManager = false;

		$scope.people = {};
		$scope.personSelected = {};

		$scope.matrix = [];
		$scope.matrix[0] = [];
		$scope.categories = [];
		$scope.aspects = [];
		$scope.user = {};

		$scope.manager = {};

		$scope.table = {};



		var color = {
			green 	: ['#66cdaa','#7fffd4','#006400','#556b2f','#8fbc8f','#2e8b57','#3cb371','#20b2aa','#98fb98','#00ff7f'],
			blue	: ['#191970','#000080','#6495ed','#483d8b','#6a5acd','#7b68ee','#8470ff','#0000cd','#4169e1','#0000ff'],
			red		: ['#ff69b4','#ff1493','#ffc0cb','#ffb6c1','#db7093','#b03060','#c71585','#d02090','#ee82ee','#dda0dd'],
			mix 	: ['#001f3f','#39CCCC','#2ECC40','#3D9970','#FF851B','#FFDC00','#FF4136','#B10DC9','#111111','#AAAAAA']
		}

		var options = 
		{	
			responsive: true,
			animation: true,
			scaleOverride : true,
			showScale: true,
			scaleSteps : 1,
			scaleStepWidth : 2,
			scaleStartValue : 1,
			multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>"    		
		}
	
	

		$scope.initialize = function(){
			
			for(var i=0;i<=50;i++){
				$scope.select.year[i]=2000+i;
			}

			//this operations are to set a default date
			var today = new Date();
			
			var month = moment(today).month();
			var year = moment(today).year();
			
			$scope.date.numberMonth = month;
			$scope.date.month = $scope.select.month[month];
			$scope.date.year = year;


			
			
			AppServices.GetAccess().then(function(data){
				
				switch(parseInt(data.access)){
					case 0:
						$scope.isManager = false;
						$scope.isAdmin	= false;

						EmployeeServices.GetEmployee().then(function(data){
							$scope.employee = data;
							var params = { 	group : data.group	};
							TableServices.GetTables(params).then(function(response){
								
								$scope.tables = response;
								for(var i = 0; i< $scope.tables.length; i++){
									var params = {
												  tableId 	 : $scope.tables[i]._id, 
												  _id 		 : $scope.employee._id,
												  date 		 : moment({y: $scope.date.year, M: $scope.date.numberMonth, d: 15}).toISOString()
												};
									
									getTable(params,i);
									
								}
							})
						});
						
						

						break;
					
					case 1: 
						$scope.isManager = true;
						$scope.isAdmin	= false;
						
						var params = {
							'_id' : $scope.employee._id
						}
						
						ManagerServices.GetEmployeeUnderManger(params).then(function(response){
							for (var i = 0; i<response.length;i++){
								findPerson(response,i);
							}
							
						});
					
						EmployeeServices.GetEmployee().then(function(response){
							$scope.people[$scope.people.length] = $scope.employee;
							
							EmployeeServices.GetEmployee().then(function(data){
								$scope.employee = data;
							});

						});
						

						

						break;
					
					case 2:
						$scope.isManager = false;
						$scope.isAdmin	= true;
						break;
					default:
						break;
						
				}
			});
		}

		function getTable(params, i){
			DashboardServices.GetDashboard(params).then(function(response){
				if(response.length == 0){
					$scope.peopleCategories[i] = null;
				}else{
					$scope.peopleCategories[i] = response;
					var params = {	table : response[0].tableId };
					
					CategoryServices.GetCategories(params).then(function(response){
						$scope.categories[i] = response;
						AspectServices.GetAspects(params).then(function(response){
							$scope.aspects[i] = response;
							

							$scope.matrix = [];

							for (var h = 0 ; h<$scope.categories[i].length; h++){
								$scope.matrix[h] = [];
								for(var k = 0 ; k < $scope.aspects[i].length; k++){
									$scope.matrix[h][k] = [];
								}
							}
							
							$scope.users = [];
							var h = 0;
							var k = 0;
							console.log($scope.peopleCategories);
							var flag = false;
							for(var j = 1 ; j <= $scope.peopleCategories[i].length; j++){
								
							

								$scope.matrix[h][k] = $scope.peopleCategories[i][j-1];

								if(j % $scope.aspects[i].length == 0 && j != 0 && h != 0){
									h++;
									k=0;
								//this separates the columns
								}else{
									k++;
								}
							}

							console.log($scope.users);
						});
					
					});
				}


				
			});
		}
		

}]);