var competitionMatricesModule = angular.module('competitionMatrices');


competitionMatricesModule.config(function($stateProvider){
	
	$stateProvider
		/*.state('index',{
			url: '/index',
			templateUrl	: 'index.html', 
			controller	: 'competitionMatricesController',
			abstract: true			
		})*/

		.state('training',{
			url: '/training',
			templateUrl	: '/matrices/training/training.matrix.tmpl.html',
			controller 	: 'trainingMatrixController'
			
		})

		.state('technologymatrix', {
			url: '/technologymatrix',
			templateUrl	: '/matrices/technology/technology.matrix.tmpl.html',
			controller 	: 'technologyMatrixController'
			
		})	

		.state('continuous-evaluation',{
			url: '/continuous-evaluation',
			templateUrl	: '/matrices/continuousevaluation/continuousevaluation.matrix.tmpl.html',
			controller 	: 'continuousEvaluationMatrixController'
		});



});