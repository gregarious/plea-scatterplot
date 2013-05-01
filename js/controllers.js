app.controller('TrackerController', function($scope, dataService) {
	var init = function() {
		var timeBuckets = dataService.getTimeBuckets();
		$scope.timeIncidentsPairs = _.map(timeBuckets, function(timeBucket) {
			return {
				timeBucket: timeBucket,
				incidents: dataService.getIncidentsInBucket(timeBucket.id)
			};
		});
		$scope.behaviorTypes = dataService.getBehaviorTypes();
	};

	$scope.addBehaviorIncident = function(timeBucketIndex) {
		var behaviorTypeId = 1;
		$scope.timeIncidentsPairs[timeBucketIndex].incidents.push({
			cssClass: 'behavior-incident-' + behaviorTypeId,
			behaviorType: dataService.getBehaviorTypes()[behaviorTypeId-1]
		});
	};

	init();
});