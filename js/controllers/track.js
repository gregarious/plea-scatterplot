app.controller('TrackerController', function($scope, dataService) {
	var fixedDayModel = dataService.getDayRecordCollection().models[0];

	var init = function() {
		$scope.currentDay = {
			_model: fixedDayModel,
			label: 'Today'
		};

		$scope.behaviorCollection = dataService.getBehaviorTypeCollection();
		var allIncidents = dataService.getBehaviorIncidents();

		/*
		 * EntryBucket class
		 */
		function EntryBucket(timeBucketModel) {
			this.timeBucketModel = timeBucketModel;
			this.incidentModels = allIncidents.where({time: timeBucketModel, day: fixedDayModel});

			this.addIncident = function(behaviorTypeModel) {
				behaviorTypeModel = $scope.behaviorCollection.get(Math.floor(Math.random() * $scope.behaviorCollection.size())+1);
				var newIncidentModel = dataService.addBehaviorIncident(
					behaviorTypeModel,
					fixedDayModel,
					this.timeBucketModel
				);

				// TODO: only manual binding happening here. consider using BB binding to update this automatically?
				this.incidentModels.push(newIncidentModel);

				return newIncidentModel;
			};

			this.removeIncident = function(behavior) {
				console.log('removing');
			};

			this.incidentExists = function(behavior) {
				console.log('incidentExists: ' + behavior);
				return false;
			};
		}

		$scope.entryBuckets = dataService.getTimeRecordCollection().map(function(timeBucket) {
			return new EntryBucket(timeBucket);
		});
	};

	init();
});
