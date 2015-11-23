'use strict'
var dashboardModule = angular.module('dashboardModule');


competitionMatricesModule.controller('viewDashboardController', 
	['$scope','$state', '$filter', 'CompetitionMatrixServices','AppServices', 'EmployeeServices','ManagerServices', 'DashboardServices', 
	function($scope, $state, $filter, CompetitionMatrixServices, AppServices, EmployeeServices, ManagerServices, DashboardServices){
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

		$scope.people = {};
		$scope.personSelected = {};

		$scope.matrix = {};

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
							getCharts()
							//getContinuousEvaluationChart();
							//getTrainingEvaluationChart();
							//getTechnologyEvaluationChart();
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
							//getMatrices();
							getContinuousEvaluationChart();
							getTrainingEvaluationChart();
							getTechnologyEvaluationChart();
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


			
			//Charts Options		
		}
		


	function AuxFunction(id, j){
		var params = {};
		params.table = j;
		console.log(j);
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
				
				params.table = $scope.matrix[j].table[0].table;
				
				//Gets information for manager Dashboard
				DashboardServices.GetManagerDashboard(params).then(function(employeeCategories){
					
					var myLineChart = null;
					var tableIndex = response[0].table;	
					if (employeeCategories.length == 0){
						//add in case of there is no data
											
						ManagerMatrixDataSet[0] = {
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

						var data = {

							labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
			    			datasets: ManagerMatrixDataSet
						};

						var chartName = matrices[tableIndex].name + 'ManagerChart';
						var legendName = matrices[tableIndex].name+'ManagerLegend';

						var ctx = document.getElementById(chartName).getContext("2d");
						myLineChart = new Chart(ctx).Line(data, options);
						document.getElementById(legendName).innerHTML = '<h4>'+myLineChart.generateLegend()+ '</h4>';
						$scope.totals.manager[tableIndex] = 0;
					}else{

						var total;
						$scope.totals.manager[tableIndex] = 0;
						for (var i=0; i< employeeCategories.length;i++){
							ManagerMatrixDataSet[i] = {
								label: $scope.matrix[j].table[i].name,
								fillColor: "rgba(220,220,220,0)",
								strokeColor: color.mix[i],
								pointColor: color.mix[i],
								pointStrokeColor: "#fff",
								pointHighlightFill: "#fff",
								pointHighlightStroke: "rgba(220,220,220,1)",
								scaleStepWidth : 3,
								scaleStartValue : 1,
								data: employeeCategories[i].Results
							}
							
							$scope.totals.manager[tableIndex] += parseInt(employeeCategories[i].Results[0]) + 
									parseInt(employeeCategories[i].Results[1]) +
									parseInt(employeeCategories[i].Results[2]) +
									parseInt(employeeCategories[i].Results[3]);
						}
						

						var data = {

							labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
			    			datasets: ManagerMatrixDataSet
			
						}

						var chartName = matrices[tableIndex].name + 'ManagerChart';
						var legendName = matrices[tableIndex].name+'ManagerLegend';

						var ctx = document.getElementById(chartName).getContext("2d");
						var myLineChart = new Chart(ctx).Line(data, options);
						document.getElementById(legendName).innerHTML = myLineChart.generateLegend();
						
					}
				});


				///Gets information for user Chart
				DashboardServices.GetUserDashboard(params).then(function(employeeCategories){
					var myLineChart = null;
					var tableIndex = response[0].table;					
					if (employeeCategories.length==0){
						//add in case of there is no data
						ManagerMatrixDataSet[0] = {
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

						var data = {

							labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
			    			datasets: ManagerMatrixDataSet
						};

						var chartName = matrices[tableIndex].name + 'UserChart';
						var legendName = matrices[tableIndex].name+'UserLegend';

						var ctx = document.getElementById(chartName).getContext("2d");
						myLineChart = new Chart(ctx).Line(data, options);
						document.getElementById(legendName).innerHTML = '<h4>'+myLineChart.generateLegend()+ '</h4>';
						$scope.totals.user[tableIndex] = 0;
						
					}else{
						$scope.totals.user[tableIndex] = 0;
						var total;
						for (var i=0; i< employeeCategories.length;i++){
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
								data: employeeCategories[i].Results
							}
								
							$scope.totals.user[tableIndex] += parseInt(employeeCategories[i].Results[0]) + 
									parseInt(employeeCategories[i].Results[1]) +
									parseInt(employeeCategories[i].Results[2]) +
									parseInt(employeeCategories[i].Results[3]);
						}
						

						var data = {

							labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
			    			datasets: UserMatrixDataSet
			
						}

						var chartName = matrices[tableIndex].name + 'UserChart';
						var legendName = matrices[tableIndex].name+'UserLegend';
						var ctx = document.getElementById(chartName).getContext("2d");
						var myLineChart = new Chart(ctx).Line(data, options);
						document.getElementById(legendName).innerHTML = myLineChart.generateLegend();
						
					}
				});
			});
	}

	function getCharts(id){
		
		for(var j = 0; j < 3 ; j++)
		{
			AuxFunction(id,j);
		}
	}
	/*
	function getContinuousEvaluationChart(id){
		var params = {};
		params.table = 2;
		CompetitionMatrixServices.GetMatrix(params).then(function(response){
			$scope.continuousCategory = response;
			var ManagerMatrixDataSet = [];
			var UserMatrixDataSet = [];
			var params = {};

			var month = moment().month($scope.date.month);
			params.date = moment({y: $scope.date.year, M: month.month() }).toISOString();
			
			if (id){
				params._id = id;
			}
			
			params.table = $scope.continuousCategory[0].table;
			
			//Gets information for manager Dashboard
			DashboardServices.GetManagerDashboard(params).then(function(employeeCategories){
				var myLineChart = null;
				if (employeeCategories.length==0){
					//add in case of there is no data
										
					ManagerMatrixDataSet[0] = {
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

					var data = {

						labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
		    			datasets: ManagerMatrixDataSet
					};

					var ctx = document.getElementById("continuousManagerChart").getContext("2d");
					myLineChart = new Chart(ctx).Line(data, options);
					document.getElementById("continuousManagerLegend").innerHTML = '<h4>'+myLineChart.generateLegend()+ '</h4>';
					$scope.totals.manager[2] = 0;
				}else{

					var total;
					$scope.totals.manager[2] = 0;

					for (var i=0; i< employeeCategories.length;i++){
						ManagerMatrixDataSet[i] = {
							label: $scope.continuousCategory[i].name,
							fillColor: "rgba(220,220,220,0)",
							strokeColor: color.mix[i],
							pointColor: color.mix[i],
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "rgba(220,220,220,1)",
							scaleStepWidth : 3,
							scaleStartValue : 1,
							data: employeeCategories[i].Results
						}
						
						$scope.totals.manager[2] += parseInt(employeeCategories[i].Results[0]) + 
								parseInt(employeeCategories[i].Results[1]) +
								parseInt(employeeCategories[i].Results[2]) +
								parseInt(employeeCategories[i].Results[3]);
					}
					

					var data = {

						labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
		    			datasets: ManagerMatrixDataSet
		
					}

					
					var ctx = document.getElementById("continuousManagerChart").getContext("2d");
					var myLineChart = new Chart(ctx).Line(data, options);
					document.getElementById("continuousManagerLegend").innerHTML = myLineChart.generateLegend();
					
				}
			});


			///Gets information for user Chart
			DashboardServices.GetUserDashboard(params).then(function(employeeCategories){
				var myLineChart = null;
				if (employeeCategories.length==0){
					//add in case of there is no data
										
					ManagerMatrixDataSet[0] = {
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

					var data = {

						labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
		    			datasets: ManagerMatrixDataSet
					};

					var ctx = document.getElementById("continuousUserChart").getContext("2d");
					myLineChart = new Chart(ctx).Line(data, options);
					document.getElementById("continuousUserLegend").innerHTML = '<h4>'+myLineChart.generateLegend()+ '</h4>';
					$scope.totals.user[2] = 0;
					
				}else{
					$scope.totals.user[2] = 0;
					var total;
					for (var i=0; i< employeeCategories.length;i++){
						UserMatrixDataSet[i] = {
							label: $scope.continuousCategory[i].name,
							fillColor: "rgba(220,220,220,0)",
							strokeColor: color.mix[i],
							pointColor: color.mix[i],
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "rgba(220,220,220,1)",
							scaleStepWidth : 3,
							scaleStartValue : 1,
							data: employeeCategories[i].Results
						}
							
						$scope.totals.user[2] += parseInt(employeeCategories[i].Results[0]) + 
								parseInt(employeeCategories[i].Results[1]) +
								parseInt(employeeCategories[i].Results[2]) +
								parseInt(employeeCategories[i].Results[3]);
					}
					

					var data = {

						labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
		    			datasets: UserMatrixDataSet
		
					}

					
					var ctx = document.getElementById("continuousUserChart").getContext("2d");
					var myLineChart = new Chart(ctx).Line(data, options);
					document.getElementById("continuousUserLegend").innerHTML = myLineChart.generateLegend();
					
				}
			});
		});
	}*/

	function getTrainingEvaluationChart(id){
		var params = {}
		params.table = 1;
		CompetitionMatrixServices.GetMatrix(params).then(function(response){
			$scope.trainingCategory = response;
			var ManagerMatrixDataSet = [];
			var UserMatrixDataSet = [];
			var params = {};

			var month = moment().month($scope.date.month);
			params.date = moment({y: $scope.date.year, M: month.month() }).toISOString();
			
			
			params.table = $scope.trainingCategory[0].table;

			if (id){
				params._id = id;
			}

			DashboardServices.GetManagerDashboard(params).then(function(employeeCategories){
				var myLineChart = null;
				if (employeeCategories.length==0){
					//add in case of there is no data
										
					ManagerMatrixDataSet[0] = {
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

					var data = {

						labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
		    			datasets: ManagerMatrixDataSet
					};

					var ctx = document.getElementById("trainingManagerChart").getContext("2d");
					myLineChart = new Chart(ctx).Line(data, options);
					document.getElementById("trainingManagerLegend").innerHTML = '<h4>'+myLineChart.generateLegend()+ '</h4>';
					$scope.totals.manager[1] = 0;
				}else{

					$scope.totals.manager[1] = 0;
					for (var i=0; i< employeeCategories.length;i++){
						ManagerMatrixDataSet[i] = {
							label: $scope.trainingCategory[i].name,
							fillColor: "rgba(220,220,220,0)",
							strokeColor: color.mix[i],
							pointColor: color.mix[i],
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "rgba(220,220,220,1)",
							scaleStepWidth : 3,
							scaleStartValue : 1,
							data: employeeCategories[i].Results
						}
						$scope.totals.manager[1] += parseInt(employeeCategories[i].Results[0]) + 
								parseInt(employeeCategories[i].Results[1]) +
								parseInt(employeeCategories[i].Results[2]) +
								parseInt(employeeCategories[i].Results[3]);
					}
					

					var data = {

						labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
		    			datasets: ManagerMatrixDataSet
		
					}

					
					var ctx = document.getElementById("trainingManagerChart").getContext("2d");
					var myLineChart = new Chart(ctx).Line(data, options);
					document.getElementById("trainingManagerLegend").innerHTML = myLineChart.generateLegend();
				}
			});

			///Gets information for user Chart
			DashboardServices.GetUserDashboard(params).then(function(employeeCategories){
				var myLineChart = null;
				if (employeeCategories.length==0){
						//add in case of there is no data
											
						ManagerMatrixDataSet[0] = {
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

						var data = {

							labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
			    			datasets: ManagerMatrixDataSet
						};

						var ctx = document.getElementById("trainingUserChart").getContext("2d");
						myLineChart = new Chart(ctx).Line(data, options);
						document.getElementById("trainingUserLegend").innerHTML = '<h4>'+myLineChart.generateLegend()+ '</h4>';
						$scope.totals.user[1] = 0;
				}else{

						var total=0;
						$scope.totals.user[1] = 0;
						for (var i=0; i< employeeCategories.length;i++){
							UserMatrixDataSet[i] = {
								label: $scope.trainingCategory[i].name,
								fillColor: "rgba(220,220,220,0)",
								strokeColor: color.mix[i],
								pointColor: color.mix[i],
								pointStrokeColor: "#fff",
								pointHighlightFill: "#fff",
								pointHighlightStroke: "rgba(220,220,220,1)",
								scaleStepWidth : 3,
								scaleStartValue : 1,
								data: employeeCategories[i].Results
							}
							
							$scope.totals.user[1] += parseInt(employeeCategories[i].Results[0]) + 
									parseInt(employeeCategories[i].Results[1]) +
									parseInt(employeeCategories[i].Results[2]) +
									parseInt(employeeCategories[i].Results[3]);
						}
						

						var data = {

							labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
			    			datasets: UserMatrixDataSet
			
						}

						
						var ctx = document.getElementById("trainingUserChart").getContext("2d");
						var myLineChart = new Chart(ctx).Line(data, options);
						document.getElementById("trainingUserLegend").innerHTML = myLineChart.generateLegend();
				}
			});
		});
	}

	function getTechnologyEvaluationChart(id){
		var params = {};
		params.table = 0;
		CompetitionMatrixServices.GetMatrix(params).then(function(response){
			
			$scope.technologyCategory = response;
			var ManagerMatrixDataSet = [];
			var UserMatrixDataSet = [];
			var params = {};


			var month = moment().month($scope.date.month);
			params.date = moment({y: $scope.date.year, M: month.month() }).toISOString();

			
			params.table = $scope.technologyCategory[0].table;
			
			if (id){
				params._id = id;
			}

			


			DashboardServices.GetManagerDashboard(params).then(function(employeeCategories){
				var myLineChart = null;
				if (employeeCategories.length==0){
					//add in case of there is no data
					$scope.totals.manager[0] = 0;
					
					
					ManagerMatrixDataSet[0] = {
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

					var data = {

						labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
		    			datasets: ManagerMatrixDataSet
					};

					var ctx = document.getElementById("technologyManagerChart").getContext("2d");
					myLineChart = new Chart(ctx).Line(data, options);
					document.getElementById("technologyManagerLegend").innerHTML = '<h4>'+myLineChart.generateLegend()+ '</h4>';
				}else{
					
					
					$scope.totals.manager[0] = 0;
					for (var i=0; i< employeeCategories.length;i++){
						ManagerMatrixDataSet[i] = {
							label: $scope.technologyCategory[i].name,
							fillColor: "rgba(220,220,220,0)",
							strokeColor: color.mix[i],
							pointColor: color.mix[i],
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "rgba(220,220,220,1)",
							scaleStepWidth : 3,
							scaleStartValue : 1,
							data: employeeCategories[i].Results
						}

						$scope.totals.manager[0] += parseInt(employeeCategories[i].Results[0]) + 
								parseInt(employeeCategories[i].Results[1]) +
								parseInt(employeeCategories[i].Results[2]) +
								parseInt(employeeCategories[i].Results[3]);
					}

					
					var data = {

						labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
		    			datasets: ManagerMatrixDataSet
					}

					

					var canvas = document.getElementById("technologyManagerChart");
					
					var ctx = document.getElementById("technologyManagerChart").getContext("2d");
					myLineChart = new Chart(ctx).Line(data, options);
					document.getElementById("technologyManagerLegend").innerHTML = myLineChart.generateLegend();
				}
			});

					///Gets information for user Chart
			DashboardServices.GetUserDashboard(params).then(function(employeeCategories){
				var myLineChart = null;
				if (employeeCategories.length==0){
					//add in case of there is no data
					$scope.totals.user[0] = 0;
					
					
					ManagerMatrixDataSet[0] = {
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

					var data = {

						labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
		    			datasets: ManagerMatrixDataSet
					};

					var ctx = document.getElementById("technologyUserChart").getContext("2d");
					myLineChart = new Chart(ctx).Line(data, options);
					document.getElementById("technologyUserLegend").innerHTML = '<h4>'+myLineChart.generateLegend()+ '</h4>';
				}else{
					
					$scope.emptyUserTechChart = false;

					$scope.totals.user[0] = 0;
					var total=0;
					for (var i=0; i< employeeCategories.length;i++){
						UserMatrixDataSet[i] = {
							label: $scope.technologyCategory[i].name,
							fillColor: "rgba(220,220,220,0)",
							strokeColor: color.mix[i],
							pointColor: color.mix[i],
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "rgba(220,220,220,1)",
							scaleStepWidth : 3,
							scaleStartValue : 1,
							data: employeeCategories[i].Results
						}
						
						$scope.totals.user[0] += parseInt(employeeCategories[i].Results[0]) + 
								parseInt(employeeCategories[i].Results[1]) +
								parseInt(employeeCategories[i].Results[2]) +
								parseInt(employeeCategories[i].Results[3]);
					}
					

					var data = {

						labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
		    			datasets: UserMatrixDataSet
		
					}

					var ctx = document.getElementById("technologyUserChart").getContext("2d");
					var myLineChart = new Chart(ctx).Line(data, options);
					document.getElementById("technologyUserLegend").innerHTML = myLineChart.generateLegend();
					
					
				}
			});
		});
	}
	
	

	function findPerson(employeesFromManager,i){
		EmployeeServices.GetEmployee(employeesFromManager[i]).then(function(response){
			$scope.people[i] = response[0];
			
		});
	}

	$scope.personChange = function(){
		var id = $scope.personSelected._id;
		//getMatrices(id);
		getContinuousEvaluationChart(id);
		getTrainingEvaluationChart(id);
		getTechnologyEvaluationChart(id);
	}


	$scope.dateChange = function(){
		var id = $scope.personSelected._id;
		if(id){
			
			getContinuousEvaluationChart(id);
			getTrainingEvaluationChart(id);
			getTechnologyEvaluationChart(id);
		}else{
			
			getContinuousEvaluationChart();
			getTrainingEvaluationChart();
			getTechnologyEvaluationChart();
		}
	}

	var filterCategory = function(param){
		CategoryServices.GetCategory(param).then(function(data){
			if(data){

			}else{

			}
		})
	}
}]);
