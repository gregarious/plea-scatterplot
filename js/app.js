var app = angular.module('app', ['$strap.directives']).
	config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/track', {
			templateUrl: 'partials/track.html',
			controller: 'TrackerController'
		}).
		when('/scatterplot', {
			templateUrl: 'partials/scatter.html',
			controller: 'ScatterplotController'
		}).
		when('/manage', {
			templateUrl: 'partials/manage.html',
			controller: 'ManageController'
		}).
		otherwise({
			redirectTo: '/track'
		});
}]);

Backbone.sync = function Sync() {
	console.log('syncing remotely');
	Backbone.ajaxSync.apply(this, arguments);
	console.log('syncing locally');
	return Backbone.localSync.apply(this, arguments);
};
