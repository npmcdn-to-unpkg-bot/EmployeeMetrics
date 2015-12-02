(function(){
	var myApp = angular.module('myApp');


	myApp.config(function($stateProvider, $urlRouterProvider, $httpProvider,$mdThemingProvider, formlyConfigProvider){
		
	formlyConfigProvider.setWrapper({
      	name: 'horizontalBootstrapLabel',
      	template: [
        	'<label for="{{::id}}" class="col-sm-2 control-label">',
    	    	'{{to.label}} {{to.required ? "*" : ""}}',
	        '</label>',
        	'<div class="col-sm-8">',
	        	'<formly-transclude></formly-transclude>',
    	    '</div>'
      	].join(' ')
    });


	    
	formlyConfigProvider.setWrapper({
	    name: 'horizontalBootstrapCheckbox',
	    template: [
	    	'<div class="col-sm-offset-2 col-sm-8">',
	    		'<formly-transclude></formly-transclude>',
	        '</div>'
	      ].join(' ')
	    });
	    
	    formlyConfigProvider.setType({
	      	name: 'horizontalInput',
	      	extends: 'input',
	      	wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
	    });
	    
	    formlyConfigProvider.setType({
		    name: 'horizontalCheckbox',
		    extends: 'checkbox',
		    wrapper: ['horizontalBootstrapCheckbox', 'bootstrapHasError']
	    });

	    formlyConfigProvider.setType({
		    name: 'horizontalSelect',
		    extends: 'select',
		    wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
	    });
  	

		$mdThemingProvider.theme('default')
    		.primaryPalette('blue')
    		.accentPalette('green');

    	$mdThemingProvider.theme("success-toast");
    	$mdThemingProvider.theme("error-toast")

		$urlRouterProvider.when('', 'login');
		$stateProvider

			.state('login',{
				url: '/login',
				templateUrl	: 'app/auth/login/auth.login.tmpl.html',
				controller 	: 'authLoginController'
				
			})

			.state('logout',{
				url: '/logout',
				templateUrl: 'app/auth/logout/auth.logout.tmpl.html',
				controller : 'authLogoutController' 
			})

			.state('app', {
				url: '/app',
				templateUrl	: 'app/auth/app.tmpl.html',
				controller 	: 'appController'
		
			})

			.state('app.password',{
				url: '/changepassword',
				templateUrl: '/app/auth/changepassword/auth.changepassword.tmpl.html',
				controller: 'changePasswordController'
			})

			.state('app.forcepassword',{
				url: '/app/changepassword/:id',
				templateUrl: '/app/auth/changepassword/auth.changepassword.tmpl.html',
				controller: 'changePasswordController'
			});


			//this function intercepts all calls to the server and checks for a 401 status code 
			//if true it sends the user to the login page
		$httpProvider.interceptors.push(function($q, $location) {
	      	return {
	        	response: function(response) {
		          	// do something on success
		          	return response;
	        	},
	        	responseError: function(response) {
		          	if (response.status === 401){
		      			$location.url('/login');
		          	}
		          	return $q.reject(response);
	        	}
	      	}
	    });
	});
})();