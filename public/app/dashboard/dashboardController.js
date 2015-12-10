'use strict'
var dashboardModule = angular.module('dashboardModule');


competitionMatricesModule.controller('viewDashboardController', 
	['$scope','$state', '$filter', 'CompetitionMatrixServices','AppServices', 'CategoryServices' ,'EmployeeServices','ManagerServices', 'DashboardServices', 'AspectServices', 'TableServices', 'GroupServices',
	function($scope, $state, $filter, CompetitionMatrixServices, AppServices,  CategoryServices , EmployeeServices, ManagerServices, DashboardServices, AspectServices, TableServices, GroupServices){ 
		$scope.employee = {};
		
		$scope.userChart = {};
		$scope.managerChart = {};


		$scope.peopleCategories = [];
		
		$scope.totals = [];

		$scope.filterTable = [];

		$scope.date = {};

		$scope.selectCategories = [];

		$scope.select = {};
		$scope.select.month = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];
		$scope.select.year = [];

		$scope.isAdmin = false;
		$scope.isManager = false;
		$scope.hasManager = false;

		$scope.people = {};
		$scope.personSelected = {};

		
		$scope.categories = [];
		$scope.aspects = [];
		$scope.user = {};

		$scope.dataCategories = [];
		$scope.dataAspects = []; 

		$scope.manager = {};

		$scope.table = {};

		$scope.matrix = [];

		var color = {
			green 	: ['#66cdaa','#7fffd4','#006400','#556b2f','#8fbc8f','#2e8b57','#3cb371','#20b2aa','#98fb98','#00ff7f'],
			blue	: ['#191970','#000080','#6495ed','#483d8b','#6a5acd','#7b68ee','#8470ff','#0000cd','#4169e1','#0000ff'],
			red		: ['#ff69b4','#ff1493','#ffc0cb','#ffb6c1','#db7093','#b03060','#c71585','#d02090','#ee82ee','#dda0dd'],
			mix 	: ['#39CCCC','#2ECC40','#3D9970','#FF851B','#FFDC00','#FF4136','#B10DC9','#ACACAC','#AAAAAA', '#001f3f']
		}


		//Options for the charts that are going to be displayed
		var options = 
		{	
			responsive: true,
			animation: true,
			scaleOverride : true,
			scaleShowGridLines : true,
			scaleGridLineColor : "rgba(0,0,0,.05)",
			scaleShowVerticalLines: true,
			scaleShowHorizontalLines: true,
			showXLabels: 8,
			showScale: true,
			scaleSteps : 2,
			scaleStepWidth : 1,
			scaleStartValue : 1,
			showTooltips: false,
			multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>" ,
			scaleFontColor: '#222'   
			
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
												  employeeId : $scope.employee._id,
												  date 		 : moment({y: $scope.date.year, M: $scope.date.numberMonth, d: 15}).toISOString()
												};
									
									getTable(params,i);
									
								}
							});
						});
						
						

						break;
					
					case 1: 
						$scope.isManager = true;
						$scope.isAdmin	= false;
						EmployeeServices.GetEmployee().then(function(data){
							$scope.employee = data;
							var params = {
								'_id' : $scope.employee._id
							}
							ManagerServices.GetEmployeeUnderManger(params).then(function(response){
								for (var i = 0; i<response.length;i++){
									findPerson(response,i);
								}
								$scope.people[$scope.people.length] = $scope.employee;
								
								var params = { 	group : $scope.employee.group	};
								
								TableServices.GetTables(params).then(function(response){
								
									$scope.tables = response;
									for(var i = 0; i< $scope.tables.length; i++){
										var params = {
													  tableId 	 : $scope.tables[i]._id, 
													  employeeId : $scope.employee._id,
													  date 		 : moment({y: $scope.date.year, M: $scope.date.numberMonth, d: 15}).toISOString()
													};
										
										getTable(params,i);
										
									}
								});



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

/*
In the following functions there is going to be used different letters for indexes
	i 	=	table
	c 	= 	categories
	a  	=	aspects
	u 	= 	user
Usually the way most of the arrays are going to be structure are going to be
$scope.peopleCategories[table][user][categories][aspects]
*/

	function getTable(params, i){
		DashboardServices.GetDashboard(params).then(function(response){
			if(response.length == 0){
				$scope.peopleCategories[i] = null;
				//do other stuff
			}else{
				$scope.peopleCategories[i] = response;
				
				
				var p = {	table :  params.tableId };
				CategoryServices.GetCategories(p).then(function(response){
					$scope.categories[i] = response;
					AspectServices.GetAspects(p).then(function(response){
						$scope.aspects[i] = response;
						
										
						$scope.dataAspects[i] = [];
						$scope.dataCategories[i] = [];
						
						//This should be module
						for(var u = 0; u< $scope.peopleCategories[i].length; u++){
							var hasCategory = [];
							var hasAspect = [];
							
							$scope.dataAspects[i][u] = [];
							$scope.dataCategories[i][u] = [];
							
							for(var index = 0; index < $scope.peopleCategories[i][u].length; index++){
								
								for(var c = 0 ; c< $scope.categories[i].length;c++){
									if($scope.peopleCategories[i][u][index].categoryId == $scope.categories[i][c]._id){
										isInArray(hasCategory, $scope.categories[i][c]);
										break;
									}
								}
								for(var a = 0; a< $scope.aspects[i].length; a++){
									if($scope.peopleCategories[i][u][index].aspectId == $scope.aspects[i][a]._id){
										isInArray(hasAspect, $scope.aspects[i][a]);
										break;
									}
								}			
							}
							$scope.dataAspects[i][u] = hasAspect;
							$scope.dataCategories[i][u] = hasCategory; 
						}
						//End of module
						
						$scope.selectCategories[i] = [];
						for(var u = 0 ; u<$scope.dataCategories[i].length; u++){
							for(var c = 0; c<$scope.dataCategories[i][u].length; c++){
								isInArray($scope.selectCategories[i], $scope.dataCategories[i][u][c]);
							}
						}

						
						$scope.matrix[i] = [];

						for(var u = 0; u< $scope.peopleCategories[i].length ; u++){
							$scope.matrix[i][u] = [];
							for(var c = 0; c < $scope.dataCategories[i][u].length; c++){
								$scope.matrix[i][u][c] = [];

								//The formula below helps me convert the $scope.peopleCategories array into a matrix
								//arrayIndex = columnNumber * numberOfAspects this is equal to the number of columns the matrix will have
								//and each category will be a new row graphic example
								/*
									$scope.peopleCategories[i][u] = [aspect11, ... ,aspect33]
									
									  			ASPECT 1   ASPECT 2  ASPECT 3
									CATEGORY 1 [ aspect11 , aspect12, aspect13]
									CATEGORY 2 [ aspect21 , aspect22, aspect23]
									CATEGORY 3 [ aspect31 , aspect32, aspect33]

								*/

								var index = c * $scope.dataAspects[i][u].length;
								for (var a = 0; a<$scope.dataAspects[i][u].length; a++ ){
									$scope.matrix[i][u][c].push($scope.peopleCategories[i][u][index].Results);
									index++;
								}
							}
							
							//time to draw the graphs
							
						}

						drawMatrix($scope.matrix,i);
					
					});
				
				});
			}


			
		});
	}

	//this function is to test if the category or aspect is in array
	function isInArray(array, element){
		//if the array is more than 0
		if(array.length > 0){
			var inArray = false;
			//go through the array
			for(var i=0 ; i< array.length; i++){
				//if it has at least one element equal another
				if(array[i]._id == element._id){
					//sets in array to true
					inArray = true;
					break;
				}
			}
			//if the element is not in the array
			if(inArray == false){
				//add the element to the array
				array.push(element);
			}
		}else{
			//if it is the first element added directly to the array
			array.push(element);
		}

	}

	function drawMatrix(matrix,i){

		var dataset = [];
		var data = [];
		
		$scope.totals[i] = [];

		for (var u = 0; u < $scope.peopleCategories[i].length ; u++)
		{
			dataset[u] = [];
			//This if checks if it is a empty matrix
			if( $scope.dataCategories[i][u].length == 0){
				var result = [];
				var label = [];
				label[u] = [];

				for(var a = 0; a< $scope.aspects[i].length; a++){
					result.push(1);
					label[u].push($scope.aspects[i][a].name);
				}

				dataset[u][0] = {
					label: 'No Data available at this time',
						fillColor: "rgba(220,220,220,.2)",
						strokeColor: color.mix[0],
						pointColor: color.mix[0],
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						scaleStepWidth : 3,
						scaleStartValue : 1,
						data: result
				};

				
				data[u] = {
					labels: label[u],
					datasets: dataset[u]
				}

				$scope.totals[i][u] = 0;

			}else{
				$scope.totals[i][u] = 0;
				//Fill the chart with data gather from the database
				for(var c = 0; c<$scope.dataCategories[i][u].length; c++){
					dataset[u][c] = {
			 			label: $scope.dataCategories[i][u][c].name,
						fillColor: "rgba(220,220,220,0)",
						strokeColor: color.mix[c],
						pointColor: color.mix[c],
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						scaleStepWidth : 3,
						scaleStartValue : 1,
						data: $scope.matrix[i][u][c]
					}
					for(var a = 0; a<$scope.matrix[i][u][c].length; a++){
						$scope.totals[i][u] += parseInt($scope.matrix[i][u][c][a]);
					}
				}
				
					
			 			
				var label = [];
				label[u] = [] 
				//Setts the labels of the attributes
				for (var a = 0 ; a< $scope.dataAspects[i][u].length; a++){
					label[u].push($scope.dataAspects[i][u][a].name);
				}

				var data = [];

				data[u] = {
					labels: label[u],
					datasets: dataset[u]
				}
			}

			var chart = $scope.tables[i].name;
			var legend = $scope.tables[i].name;

			if(u == 0){
				chart += 'ManagerChart';
				legend += 'ManagerLegend';
			}else{
				chart += 'UserChart'
				legend += 'UserLegend';
			}

			var ctx = document.getElementById(chart).getContext("2d");
			var myLineChart = new Chart(ctx).Line(data[u], options);
			document.getElementById(legend).innerHTML = myLineChart.generateLegend();
			
		}
			
	}
	
	$scope.dateChange = function(){

		var month = moment().month($scope.date.month);
		
		for(var i = 0; i< $scope.tables.length; i++){
			var params = {
						  tableId 	 : $scope.tables[i]._id, 
						  _id 		 : $scope.personSelected._id,
						  date 		 : moment({y: $scope.date.year, M: month.month(), d: 15}).toISOString()
						};
			
			getTable(params,i);
			
		}
	}

	$scope.personChange = function(){

		var month = moment().month($scope.date.month);
		
		for(var i = 0; i< $scope.tables.length; i++){
			var params = {
						  tableId 	 : $scope.tables[i]._id, 
						  _id 		 : $scope.personSelected._id,
						  date 		 : moment({y: $scope.date.year, M: month.month(), d: 15}).toISOString()
						};
			
			getTable(params,i);
			
		}
	}


	function reloadTable(tableIndex){
		var month = moment().month($scope.date.month);
		var params = {
						  tableId 	 : $scope.filterTable[tableIndex], 
						  _id 		 : $scope.personSelected._id,
						  date 		 : moment({y: $scope.date.year, M: month.month(), d: 15}).toISOString()
						};

		drawMatrix($scope.matrix,tableIndex);

	}

	function findPerson(employeesFromManager,i){
		EmployeeServices.GetEmployee(employeesFromManager[i]).then(function(response){
			$scope.people[i] = response[0];
			
		});
	}

	$scope.filterCategory = function(tableIndex){
		var UserMatrixDataSet = {};
		var ManagerMatrixDataSet = {};
		
		
		var userFound = false;
		var managerFound = false;

		if($scope.filterTable[tableIndex] == null || $scope.filterTable[tableIndex] == ''){
			reloadTable(tableIndex);
		
		}else{
			var label = [];
			var data = [];
			var dataset = [];
			
						
			for(var user = 0; user < $scope.dataCategories[tableIndex].length; user++){
				
				if($scope.dataCategories[tableIndex][user].length != 0){
					for (var category = 0; category < $scope.selectCategories[tableIndex].length; category++){
						if($scope.filterTable[tableIndex] == $scope.selectCategories[tableIndex][category]._id){
						
							if($scope.matrix[tableIndex][user][category]){
								dataset[user] = {
									label: $scope.selectCategories[tableIndex][category].name,
									fillColor: "rgba(220,220,220,0)",
									strokeColor: color.mix[category],
									pointColor: color.mix[category],
									pointStrokeColor: "#fff",
									pointHighlightFill: "#fff",
									pointHighlightStroke: "rgba(220,220,220,1)",
									scaleStepWidth : 3,
									scaleStartValue : 1,
									data: $scope.matrix[tableIndex][user][category]
								};
							}else{
								var auxData = [];
								for(var auxIndex = 0 ; auxIndex < $scope.dataAspects[tableIndex][user].length; auxIndex++){
									auxData.push(1);
								}
								dataset[user] = {
									label: 'No data available for this category',
									fillColor: "rgba(220,220,220,0)",
									strokeColor: color.mix[0],
									pointColor: color.mix[0],
									pointStrokeColor: "#fff",
									pointHighlightFill: "#fff",
									pointHighlightStroke: "rgba(220,220,220,1)",
									scaleStepWidth : 3,
									scaleStartValue : 1,
									data: auxData
								};
							}

						}
						
					}
					

					label[user] = [] 
					//Setts the labels of the attributes
					for (var a = 0 ; a< $scope.dataAspects[tableIndex][user].length; a++){
						label[user].push($scope.dataAspects[tableIndex][user][a].name);
					}


					data[user] = {
						labels: label[user],
						datasets: [dataset[user]]		//Dataset user will only send one element and it will be considered as an object with [] we are putting the objects inside an array
					}
					
					var chart = $scope.tables[tableIndex].name;
					var legend = $scope.tables[tableIndex].name;

					if(user == 0){
						chart += 'ManagerChart';
						legend += 'ManagerLegend';
					}else{
						chart += 'UserChart'
						legend += 'UserLegend';
					}

					

					var ctx = document.getElementById(chart).getContext("2d");
					
					var myLineChart = new Chart(ctx).Line(data[user], options);
					
					document.getElementById(legend).innerHTML = myLineChart.generateLegend();
				}
					
			}


		}

		// 	for (var i = 0; i < $scope.user[0].table[tableIndex].categories.length;i++)
		// 	{
		// 		if(params._id.toString() === $scope.user[0].table[tableIndex].categories[i].categoryId.toString())
		// 		{
					
		// 			managerFound = true;

		// 			ManagerMatrixDataSet[0] = {
		// 				 			label: params.name,
		// 							fillColor: "rgba(220,220,220,0)",
		// 							strokeColor: color.mix[i],
		// 							pointColor: color.mix[i],
		// 							pointStrokeColor: "#fff",
		// 							pointHighlightFill: "#fff",
		// 							pointHighlightStroke: "rgba(220,220,220,1)",
		// 							scaleStepWidth : 3,
		// 							scaleStartValue : 1,
		// 							data: $scope.user[0].table[tableIndex].categories[i].Results
		// 			};

		// 			var data = {
		// 				labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
		//     			datasets: ManagerMatrixDataSet
		// 			}

										
		// 			var managerChart = matrices[tableIndex].name + "ManagerChart";;
		// 			var managerLengend = matrices[tableIndex].name+ "ManagerLegend";
		// 			var ctx = document.getElementById(managerChart).getContext("2d");
		// 			var myLineChart = new Chart(ctx).Line(data, options);
		// 			document.getElementById(managerLengend).innerHTML = myLineChart.generateLegend();
					
					
		// 			break;
		// 		}
		// 	}
			
		// 	for(var i = 0; i < $scope.user[1].table[tableIndex].categories.length;i++)
		// 	{
		// 		if(params._id.toString() === $scope.user[1].table[tableIndex].categories[i].categoryId.toString())
		// 		{
		// 				userFound = true;
		// 				UserMatrixDataSet[0] = {
		// 	 			label: params.name,
		// 				fillColor: "rgba(220,220,220,0)",
		// 				strokeColor: color.mix[i],
		// 				pointColor: color.mix[i],
		// 				pointStrokeColor: "#fff",
		// 				pointHighlightFill: "#fff",
		// 				pointHighlightStroke: "rgba(220,220,220,1)",
		// 				scaleStepWidth : 3,
		// 				scaleStartValue : 1,
		// 				data: $scope.user[1].table[tableIndex].categories[i].Results
		// 			};

		// 			var data = {
		// 				labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
		//     			datasets: UserMatrixDataSet
		// 			}

		// 			var userChart = matrices[tableIndex].name + "UserChart";
		// 			var userLengend = matrices[tableIndex].name+ "UserLegend";
		// 			var ctx2 = document.getElementById(userChart).getContext("2d");
		// 			var userLineChart = new Chart(ctx2).Line(data, options);
		// 			document.getElementById(userLengend).innerHTML = userLineChart.generateLegend();
					

		// 			break;
		// 		}
		// 	}
			
		// 	if(!managerFound){
		// 		ManagerMatrixDataSet[0] = {
		//  			label: 'No Data Available',
		// 			fillColor: "rgba(220,220,220,0)",
		// 			strokeColor: color.mix[i],
		// 			pointColor: color.mix[i],
		// 			pointStrokeColor: "#fff",
		// 			pointHighlightFill: "#fff",
		// 			pointHighlightStroke: "rgba(220,220,220,1)",
		// 			scaleStepWidth : 3,
		// 			scaleStartValue : 1,
		// 			data: [1,1,1,1]
		// 		};

		// 		var data = {
		// 			labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
		// 			datasets: ManagerMatrixDataSet
		// 		}

									
		// 		var managerChart = matrices[tableIndex].name + "ManagerChart";;
		// 		var managerLengend = matrices[tableIndex].name+ "ManagerLegend";
		// 		var ctx = document.getElementById(managerChart).getContext("2d");
		// 		var myLineChart = new Chart(ctx).Line(data, options);
		// 		document.getElementById(managerLengend).innerHTML = myLineChart.generateLegend();
		// 	}

		// 	if(!userFound){
		// 		UserMatrixDataSet[0] = {
		//  			label: 'No Data Available',
		// 			fillColor: "rgba(220,220,220,0)",
		// 			strokeColor: color.mix[i],
		// 			pointColor: color.mix[i],
		// 			pointStrokeColor: "#fff",
		// 			pointHighlightFill: "#fff",
		// 			pointHighlightStroke: "rgba(220,220,220,1)",
		// 			scaleStepWidth : 3,
		// 			scaleStartValue : 1,
		// 			data: [1,1,1,1]
		// 		};

		// 		var data = {
		// 			labels: ["JS Frameworks (Angular/Backbone)", "Databases (Mongo / SQL Server)", "Core javascript / jquery", "HTML5.0 / CSS3.0"],
		// 			datasets: UserMatrixDataSet
		// 		}

									
		// 		var managerChart = matrices[tableIndex].name + "UserChart";;
		// 		var managerLengend = matrices[tableIndex].name+ "UserLegend";
		// 		var ctx = document.getElementById(managerChart).getContext("2d");
		// 		var myLineChart = new Chart(ctx).Line(data, options);
		// 		document.getElementById(managerLengend).innerHTML = myLineChart.generateLegend();
		// 	}	
		// }
	};
}]);