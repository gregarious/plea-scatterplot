app.controller('TrackerController', function($scope, dataService) {
	var init = function() {
		var day = dataService.getDayRecordCollection().models[0];

		$scope.currentDay = {
			model: day,
			label: 'Today'
		};

		$scope.behaviors = dataService.getBehaviorTypeCollection().map(function(model) {
			return {
				model: model
			};
		});

		var allIncidents = dataService.getBehaviorIncidents();
		$scope.timeBuckets = dataService.getTimeRecordCollection().map(function(model) {
			return {
				timeRecord: model,
				incidents: allIncidents.where({time: model, day: day})
			};
		});
	};

	$scope.addBehaviorIncident = function(behaviorType, timeBucket) {
		// TODO
		// $scope.timeIncidentsPairs[timeBucketIndex].incidents.push({
		// 	cssClass: 'behavior-incident-' + behaviorTypeId,
		// 	behaviorType: dataService.getBehaviorTypes()[behaviorTypeId-1]
		// });
	};

	init();
});
