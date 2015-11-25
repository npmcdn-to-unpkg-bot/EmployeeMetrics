'use strict'
var dashboardModule = angular.module('dashboardModule');


competitionMatricesModule.controller('viewDashboardController', 
	['$scope','$state', '$filter', 'CompetitionMatrixServices','AppServices', 'CategoryServices' ,'EmployeeServices','ManagerServices', 'DashboardServices', 
	function($scope, $state, $filter, CompetitionMatrixServices, AppServices,  CategoryServices , EmployeeServices, ManagerServices, DashboardServices){
		$scope.employee = {};
		
		$scope.userChart = {};
		$scope.managerChart = {};

		$scope.continuousCategory = {};
		$scope.trainingCategory = {};
		$scope.technologyCategory= {};
		
		$scope.totals = {};
		$scope.totals.user = [0,0,0];
		$scope.totals.manager = [0,0,0];
		

		$scope.date = {};


		$scope.select = {};
		$scope.select.month = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];
		$scope.select.year = [];

		$scope.isAdmin = false;
		$scope.isManager = false;
		$scope.hasManager = false;

		$scope.people = {};
		$scope.personSelected = {};

		$scope.matrix = {};

		$scope.user = {};

		$scope.manager = {};

		var matrices = [{
			'id': 0,
			'name' : 'technology'
		},
		{
			'id': 1,
			'name' : 'training'
		},
		{
			'id': 2,
			'name' : 'continuous'
		}
		];



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
			today = moment(today).subtract(1,'month')
			var month = moment(today).month();
			var year = moment(today).year();
			
			$scope.date.month = $scope.select.month[month];
			$scope.date.year = year;


			
			EmployeeServices.GetEmployee().then(function(data){
				$scope.employee = data;
				
				AppServices.GetAccess().then(function(data){
					
					switch(parseInt(data.access)){
						case 0:
							$scope.isManager = false;
							$scope.isAdmin	= false;

							//Chart for continuous evaluation
							getCharts();

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
							});
							
							getCharts();

							break;
						
						case 2:
							$scope.isManager = false;
							$scope.isAdmin	= true;
							break;
						default:
							break;
							
					}
				});
				
			});
		
		}
		


	function AuxFunction(id, j){
		var params = {};
		params.table = j;
		var Executed = false;
		CompetitionMatrixServices.GetMatrix(params).then(function(response){
				$scope.matrix[j] = {};
				$scope.matrix[j].table = {};
				$scope.matrix[j].table = response;
				
				var ManagerMatrixDataSet = [];
				var UserMatrixDataSet = [];
				var params = {};

				var month = moment().month($scope.date.month);
				params.date = moment({y: $scope.date.year, M: month.month() }).toISOString();
				
				if (id){
					params._id = id;
				}
				
				//Gets the table code
				params.table = $scope.matrix[j].table[0].table;
				

				DashboardServices.GetDashboard(params).then(function(employeeCategories){
					var myLineChart = null;
					var tableIndex = response[0].table;		
					
					
					
					for(var i=0;i<employeeCategories.length;i++){
						if (employeeCategories[i].managerId === null){
							$scope.user[1].table[tableIndex].categories.push(employeeCategories[i]);
						}else{
							$scope.user[0].table[tableIndex].categories.push(employeeCategories[i]);
						}
					}
					
					$scope.user[0].table[tableIndex].categories.sort(categorySort);
					$scope.user[1].table[tableIndex].categories.sort(categorySort);
					
					$scope.totals.user[tableIndex] = 0;
					$scope.totals.manager[tableIndex] = 0;
					
					var total;
					var UserMatrixDataSet = [];
					
					for(var h = 0; h < 2;h++ ){
						if($scope.user[h].table[tableIndex].categories.length == 0)
				 		{
				 			UserMatrixDataSet[0] = {
								label: 'No Data Available',
								fillColor: "rgba(0,0,0,1)",
								strokeColor: color.mix[0],
								pointColor: color.mix[0],
								pointStrokeColor: "#000",
								pointHighlightFill: "#000",
								pointHighlightStroke: "rgba(0,0,0,1)",
								scaleStepWidth : 3,
								scaleStartValue : 1,
								data: [1,1,1,1]
							}
						}else{
						 	for (var i= 0; i< $scope.user[h].table[tableIndex].categories.length;i++){
						 		
						 		var params = {};
						 		params.id = $scope.user[h].table[tableIndex].categories[i].managerId;
								if (params.id != null && Executed === false && $scope.hasManager === false){
									Executed = true;
									$scope.hasManager = true;
									EmployeeServices.GetEmployee(params).then(function(response){
										$scope.manager = response[0];
									});
								}


					 			UserMatrixDataSet[i] = {
						 			label: $scope.matrix[j].table[i].name,
									fillColor: "rgba(220,220,220,0)",
									strokeColor: color.mix[i],
									pointColor: color.mix[i],
									pointStrokeColor: "#fff",
									pointHighlightFill: "#fff",
									pointHighlightStroke: "rgba(220,220,220,1)",
									scaleStepWidth : 3,
									scaleStartValue : 1,
									data: $scope.user[h].table[tableIndex].categories[i].Results
								}
								
								if(h == 0){
									$scope.totals.user[tableIndex] += parseInt($scope.user[h].table[tableIndex].categories[i].Results[0]) + 
											parseInt($scope.user[h].table[tableIndex].categories[i].Results[1]) +
											parseInt($scope.user[h].table[tableIndex].categories[i].Results[2]) +
											parseInt($scope.user[h].table[tableIndex].categories[i].Results[3]);
								}else{
									$scope.totals.manager[tableIndex] += parseInt($scope.user[h].table[tableIndex].categories[i].Results[0]) + 
											parseInt($scope.user[h].table[tableIndex].categories[i].Results[1]) +
											parseInt($scope.user[h].table[tableIndex].categories[i].Results[2]) +
											parseInt($scope.user[h].table[tableIndex].categories[i].Results[3]);
								}
							}
						 			
						}
							
						var data = {
							labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
			    			datasets: UserMatrixDataSet
						}
						var userChart = (h == 0) ? "Manager" : "User";
						
						var chartName = matrices[tableIndex].name + userChart+"Chart";
						var legendName = matrices[tableIndex].name+ userChart+"Legend";
						var ctx = document.getElementById(chartName).getContext("2d");
						
						var myLineChart = new Chart(ctx).Line(data, options);
						document.getElementById(legendName).innerHTML = myLineChart.generateLegend();
						
					
					
			 	}
			 });
			
		});
	}

	function getCharts(id){
		
		for (var i = 0; i< 2;i++){
			$scope.user[i] = {};
			$scope.user[i].table = {};
			for (var j = 0; j< 3; j++){
				$scope.user[i].table[j] = {};
				$scope.user[i].table[j].categories = [];
			}
		}
		
		$scope.hasManager = false;
		for(var j = 0; j < 3 ; j++)
		{
			AuxFunction(id,j);
		}
	}


	
	

	function findPerson(employeesFromManager,i){
		EmployeeServices.GetEmployee(employeesFromManager[i]).then(function(response){
			$scope.people[i] = response[0];
			
		});
	}

	$scope.personChange = function(){
		var id = $scope.personSelected._id;
		getCharts(id);
	}


	$scope.dateChange = function(){
		var id = $scope.personSelected._id;
		if(id){
			getCharts(id);
		}else{
			getCharts();
		}
	}

	function categorySort(a,b){
		if(a.categoryId.toString() < b.categoryId.toString())
			return -1;
		if(a.categoryId.toString() > b.categoryId.toString())
			return 1;
		return 0;
	}

	function categorySort2(a,b){
		if(a._id.toString() < b._id.toString())
			return -1;
		if(a._id.toString() > b._id.toString())
			return 1;
		return 0;
	}

	$scope.filterCategory = function(params, tableIndex){
		var UserMatrixDataSet = {};
		var ManagerMatrixDataSet = {};
		
		
		var userFound = false;
		var managerFound = false;

		
		$scope.matrix[tableIndex].table.sort(categorySort2);
		$scope.user[0].table[tableIndex].categories.sort(categorySort);
		$scope.user[1].table[tableIndex].categories.sort(categorySort);

		if(!params){
			redrawMatrixChart(tableIndex);
		
		}else{
			for (var i = 0; i < $scope.user[0].table[tableIndex].categories.length;i++)
			{
				if(params._id.toString() === $scope.user[0].table[tableIndex].categories[i].categoryId.toString())
				{
					
					managerFound = true;

					ManagerMatrixDataSet[0] = {
						 			label: params.name,
									fillColor: "rgba(220,220,220,0)",
									strokeColor: color.mix[i],
									pointColor: color.mix[i],
									pointStrokeColor: "#fff",
									pointHighlightFill: "#fff",
									pointHighlightStroke: "rgba(220,220,220,1)",
									scaleStepWidth : 3,
									scaleStartValue : 1,
									data: $scope.user[0].table[tableIndex].categories[i].Results
					};

					var data = {
						labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
		    			datasets: ManagerMatrixDataSet
					}

										
					var managerChart = matrices[tableIndex].name + "ManagerChart";;
					var managerLengend = matrices[tableIndex].name+ "ManagerLegend";
					var ctx = document.getElementById(managerChart).getContext("2d");
					var myLineChart = new Chart(ctx).Line(data, options);
					document.getElementById(managerLengend).innerHTML = myLineChart.generateLegend();
					
					
					break;
				}
			}
			
			for(var i = 0; i < $scope.user[1].table[tableIndex].categories.length;i++)
			{
				if(params._id.toString() === $scope.user[1].table[tableIndex].categories[i].categoryId.toString())
				{
						userFound = true;
						UserMatrixDataSet[0] = {
			 			label: params.name,
						fillColor: "rgba(220,220,220,0)",
						strokeColor: color.mix[i],
						pointColor: color.mix[i],
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						scaleStepWidth : 3,
						scaleStartValue : 1,
						data: $scope.user[1].table[tableIndex].categories[i].Results
					};

					var data = {
						labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
		    			datasets: UserMatrixDataSet
					}

					var userChart = matrices[tableIndex].name + "UserChart";
					var userLengend = matrices[tableIndex].name+ "UserLegend";
					var ctx2 = document.getElementById(userChart).getContext("2d");
					var userLineChart = new Chart(ctx2).Line(data, options);
					document.getElementById(userLengend).innerHTML = userLineChart.generateLegend();
					

					break;
				}
			}
			
			if(!managerFound){
				ManagerMatrixDataSet[0] = {
		 			label: 'No Data Available',
					fillColor: "rgba(220,220,220,0)",
					strokeColor: color.mix[i],
					pointColor: color.mix[i],
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					scaleStepWidth : 3,
					scaleStartValue : 1,
					data: [1,1,1,1]
				};

				var data = {
					labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
					datasets: ManagerMatrixDataSet
				}

									
				var managerChart = matrices[tableIndex].name + "ManagerChart";;
				var managerLengend = matrices[tableIndex].name+ "ManagerLegend";
				var ctx = document.getElementById(managerChart).getContext("2d");
				var myLineChart = new Chart(ctx).Line(data, options);
				document.getElementById(managerLengend).innerHTML = myLineChart.generateLegend();
			}

			if(!userFound){
				UserMatrixDataSet[0] = {
		 			label: 'No Data Available',
					fillColor: "rgba(220,220,220,0)",
					strokeColor: color.mix[i],
					pointColor: color.mix[i],
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					scaleStepWidth : 3,
					scaleStartValue : 1,
					data: [1,1,1,1]
				};

				var data = {
					labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
					datasets: UserMatrixDataSet
				}

									
				var managerChart = matrices[tableIndex].name + "UserChart";;
				var managerLengend = matrices[tableIndex].name+ "UserLegend";
				var ctx = document.getElementById(managerChart).getContext("2d");
				var myLineChart = new Chart(ctx).Line(data, options);
				document.getElementById(managerLengend).innerHTML = myLineChart.generateLegend();
			}	
		}
	};

	function redrawMatrixChart(tableIndex){
 		var UserMatrixDataSet = [];
 		var ManagerMatrixDataSet = [];
 		var userData = {};
 		var managerData = {};
 		
 		if($scope.user[1].table[tableIndex].categories.length == 0){
 			UserMatrixDataSet[0] = {
	 			label: 'No Data Available',
				fillColor: "rgba(220,220,220,0)",
				strokeColor: color.mix[0],
				pointColor: color.mix[i],
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				scaleStepWidth : 3,
				scaleStartValue : 1,
				data: [1,1,1,1]
			};

			userData = {
				labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
    			datasets: UserMatrixDataSet
			}
 		}else{
	 		for (var i = 0; i< $scope.user[1].table[tableIndex].categories.length; i++){
	 			UserMatrixDataSet[i] = {
		 			label: $scope.matrix[tableIndex].table[i].name,
					fillColor: "rgba(220,220,220,0)",
					strokeColor: color.mix[i],
					pointColor: color.mix[i],
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					scaleStepWidth : 3,
					scaleStartValue : 1,
					data: $scope.user[1].table[tableIndex].categories[i].Results
				};

				userData = {
					labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
	    			datasets: UserMatrixDataSet
				}
	 		}
 			
 		}

 		if($scope.user[0].table[tableIndex].categories.length == 0){
 			ManagerMatrixDataSet[0] = {
	 			label: 'No Data Available',
				fillColor: "rgba(220,220,220,0)",
				strokeColor: color.mix[0],
				pointColor: color.mix[0],
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				scaleStepWidth : 3,
				scaleStartValue : 1,
				data: [1,1,1,1]
			};

			var managerData = {
				labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
				datasets: ManagerMatrixDataSet
			}
 		}else{
	 		for (var i = 0; i< $scope.user[0].table[tableIndex].categories.length; i++){
	 			ManagerMatrixDataSet[i] = {
		 			label: $scope.matrix[tableIndex].table[i].name,
					fillColor: "rgba(220,220,220,0)",
					strokeColor: color.mix[i],
					pointColor: color.mix[i],
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					scaleStepWidth : 3,
					scaleStartValue : 1,
					data: $scope.user[0].table[tableIndex].categories[i].Results
				};

				var managerData = {
					labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
					datasets: ManagerMatrixDataSet
				}

	 		}
 		}

		var managerChart = matrices[tableIndex].name + "ManagerChart";;
		var managerLengend = matrices[tableIndex].name+ "ManagerLegend";
		var ctx = document.getElementById(managerChart).getContext("2d");
		var myLineChart = new Chart(ctx).Line(managerData, options);
		document.getElementById(managerLengend).innerHTML = myLineChart.generateLegend();

		var userChart = matrices[tableIndex].name + "UserChart";
		var userLengend = matrices[tableIndex].name+ "UserLegend";
		var ctx2 = document.getElementById(userChart).getContext("2d");
		var userLineChart = new Chart(ctx2).Line(userData, options);
		document.getElementById(userLengend).innerHTML = userLineChart.generateLegend();
	}
}]);