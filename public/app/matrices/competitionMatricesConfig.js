var competitionMatricesModule = angular.module('competitionMatrices');


competitionMatricesModule.config(function($stateProvider){
	
	$stateProvider

		.state('training',{
			url: '/training',
			templateUrl	: 'app/matrices/training/training.matrix.tmpl.html',
			controller 	: 'trainingMatrixController'
			
		})

		.state('technologymatrix', {
			url: '/technologymatrix',
			templateUrl	: 'app/matrices/technology/technology.matrix.tmpl.html',
			controller 	: 'technologyMatrixController'
			
		})	

		.state('continuous-evaluation',{
			url: '/continuous-evaluation',
			templateUrl	: 'app/matrices/continuousevaluation/continuousevaluation.matrix.tmpl.html',
			controller 	: 'continuousEvaluationMatrixController'
		});



});