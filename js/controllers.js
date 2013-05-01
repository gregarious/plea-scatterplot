app.controller('TrackerController', function($scope, dataService) {
	var timeBuckets = dataService.getTimeBuckets();

	$scope.timeIncidentsPairs = _.map(timeBuckets, function(timeBucket) {
		return {
			timeBucket: timeBucket,
			incidents: dataService.getIncidentsInBucket(timeBucket.id)
		};
	});

	$scope.behaviorTypes = dataService.getBehaviorTypes();
	console.log($scope);
});