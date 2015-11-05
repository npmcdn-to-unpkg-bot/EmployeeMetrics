'use strict';
var dashboardModule = angular.module('dashboardModule');


competitionMatricesModule.controller('viewDashboardController', 
	['$scope', '$rootScope','$state', '$window','$filter', 'CompetitionMatrixServices','AppServices', 'EmployeeServices','ManagerServices', 'DashboardServices', 
	function($scope, $rootScope, $state, $window, $filter, CompetitionMatrixServices, AppServices, EmployeeServices, ManagerServices, DashboardServices){
		$scope.employee = {};
		$scope.token = $window.sessionStorage.token;
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

		$scope.emptyUserTechChart = false;


		var color = {
			green 	: ['#66cdaa','#7fffd4','#006400','#556b2f','#8fbc8f','#2e8b57','#3cb371','#20b2aa','#98fb98','#00ff7f'],
			blue	: ['#191970','#000080','#6495ed','#483d8b','#6a5acd','#7b68ee','#8470ff','#0000cd','#4169e1','#0000ff'],
			red		: ['#ff69b4','#ff1493','#ffc0cb','#ffb6c1','#db7093','#b03060','#c71585','#d02090','#ee82ee','#dda0dd']
		}

		var options = 
			{	
				responsive: true,
				animation: true,
				scaleOverride : true,
				scaleSteps : 1,
				scaleStepWidth : 2,
				scaleStartValue : 1,
				multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>"
        		
			}
		

		$scope.dateChange = function(){
			getContinuousEvaluationChart();
			getTechnologyEvaluationChart();
			getTrainingEvaluationChart();
		}	

		$scope.initialize = function(){
			$rootScope.validate();
			
			for(var i=0;i<=50;i++){
				$scope.select.year[i]=2000+i;
			}

			//this operations are to set a default date
			var today = new Date();
			var month = moment(today).month();
			var year = moment(today).year();
			month--;
			$scope.date.month = $scope.select.month[month];
			$scope.date.year = year;

			

			//get the token from the window session storage
			var token = { token: $window.sessionStorage.token};
			
			EmployeeServices.GetEmployee(token).then(function(data){
				$scope.employee = data[0];
			});


			
			//Charts Options

			AppServices.GetAccess(token).then(function(access){
				switch(parseInt(access)){
					case 0:
						//Chart for continuous evaluation
						getContinuousEvaluationChart();
						getTechnologyEvaluationChart();
						getTrainingEvaluationChart();
						
						break;
					
					case 1: 
						/*getContinuousEvaluationChart();
						getTechnologyEvaluationChart();
						getTrainingEvaluationChart();*/
						break;
					
					case 2:
						console.log('admin')
						break;
					default:
						break;
						
				}
			});
		}

	function getContinuousEvaluationChart(){
		CompetitionMatrixServices.GetContinuousEvaluationCategories().then(function(response){
			$scope.continuousCategory = response;
			var ManagerMatrixDataSet = [];
			var UserMatrixDataSet = [];
			var params = {};

			var month = moment().month($scope.date.month);
			params.date = moment({y: $scope.date.year, M: month.month() }).toISOString();
			
			
			params.token = $window.sessionStorage.token;
			params.table = $scope.continuousCategory[0].table;
			
			//Gets information for manager Dashboard
			DashboardServices.GetManagerDashboard(params).then(function(employeeCategories){
				if (employeeCategories.length == 0){
					//add in case of there is no data
					$scope.totals.manager[2] = 0;
				}else{

					var total;
					$scope.totals.manager[2] = 0;

					for (var i=0; i< $scope.continuousCategory.length;i++){
						ManagerMatrixDataSet[i] = {
							label: $scope.continuousCategory[i].name,
							fillColor: "rgba(220,220,220,0)",
							strokeColor: color.green[i],
							pointColor: color.green[i],
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
				if (employeeCategories.length == 0){
					//add in case of there is no data
					$scope.totals.user[2] = 0;
					
				}else{
					$scope.totals.user[2] = 0;
					var total;
					for (var i=0; i< $scope.continuousCategory.length;i++){
						UserMatrixDataSet[i] = {
							label: $scope.continuousCategory[i].name,
							fillColor: "rgba(220,220,220,0)",
							strokeColor: color.green[i],
							pointColor: color.green[i],
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
	}

	function getTrainingEvaluationChart(){
			CompetitionMatrixServices.GetTrainingCategories().then(function(response){
			$scope.trainingCategory = response;
			var ManagerMatrixDataSet = [];
			var UserMatrixDataSet = [];
			var params = {};

			var month = moment().month($scope.date.month);
			params.date = moment({y: $scope.date.year, M: month.month() }).toISOString();
			
			params.token = $window.sessionStorage.token;
			params.table = $scope.trainingCategory[0].table;


			DashboardServices.GetManagerDashboard(params).then(function(employeeCategories){
				if (employeeCategories.length == 0){
					//add in case of there is no data
					$scope.totals.manager[1] = 0;
				}else{

					$scope.totals.manager[1] = 0;
					for (var i=0; i< $scope.trainingCategory.length;i++){
						ManagerMatrixDataSet[i] = {
							label: $scope.trainingCategory[i].name,
							fillColor: "rgba(220,220,220,0)",
							strokeColor: color.red[i],
							pointColor: color.red[i],
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
				if (employeeCategories.length == 0){
					//add in case of there is no data
					$scope.totals.user[1] = 0;
				}else{

					var total=0;
					$scope.totals.user[1] = 0;
					for (var i=0; i< $scope.trainingCategory.length;i++){
						UserMatrixDataSet[i] = {
							label: $scope.trainingCategory[i].name,
							fillColor: "rgba(220,220,220,0)",
							strokeColor: color.red[i],
							pointColor: color.red[i],
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

	function getTechnologyEvaluationChart(){
		CompetitionMatrixServices.GetTechnologyCategories().then(function(response){
			$scope.technologyCategory = response;
			var ManagerMatrixDataSet = [];
			var UserMatrixDataSet = [];
			var params = {};


			var month = moment().month($scope.date.month);
			params.date = moment({y: $scope.date.year, M: month.month() }).toISOString();

			params.token = $window.sessionStorage.token;
			params.table = $scope.technologyCategory[0].table;
			


			DashboardServices.GetManagerDashboard(params).then(function(employeeCategories){
				if (employeeCategories.length == 0){
					//add in case of there is no data
					$scope.totals.manager[0] = 0;
				}else{

					$scope.totals.manager[0] = 0;
					for (var i=0; i< $scope.technologyCategory.length;i++){
						ManagerMatrixDataSet[i] = {
							label: $scope.technologyCategory[i].name,
							fillColor: "rgba(220,220,220,0)",
							strokeColor: color.blue[i],
							pointColor: color.blue[i],
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

					
					var ctx = document.getElementById("technologyManagerChart").getContext("2d");
					var myLineChart = new Chart(ctx).Line(data, options);
					document.getElementById("technologyManagerLegend").innerHTML = myLineChart.generateLegend();
				}
			});

					///Gets information for user Chart
			DashboardServices.GetUserDashboard(params).then(function(employeeCategories){
				$scope.totals.user[0]=0;
				if (employeeCategories.length == 0){
					//add in case of there is no data
					$scope.emptyUserTechChart = true;
					$scope.totals.user[0] = 0;
					
				}else{
					
					$scope.emptyUserTechChart = false;


					var total=0;
					for (var i=0; i< $scope.technologyCategory.length;i++){
						UserMatrixDataSet[i] = {
							label: $scope.technologyCategory[i].name,
							fillColor: "rgba(220,220,220,0)",
							strokeColor: color.blue[i],
							pointColor: color.blue[i],
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

					var canvas = document.getElementById("technologyUserChart");
					canvas.width = 300;
					canvas.height = 300;
					var ctx = (document.getElementById("technologyUserChart") != null) ? document.getElementById("technologyUserChart").getContext("2d") : null;
					if (ctx!=null){
						var myLineChart = new Chart(ctx).Line(data, options);
						document.getElementById("technologyUserLegend").innerHTML = myLineChart.generateLegend();
					}
					
				}
			});
		});
	}



}]);
