Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

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
				var newIncidentModel = dataService.addBehaviorIncident(
					behaviorTypeModel,
					fixedDayModel,
					this.timeBucketModel
				);

				// TODO: manual binding happening here. consider using BB binding to update this automatically?
				this.incidentModels.push(newIncidentModel);

				return newIncidentModel;
			};

			this.removeIncident = function(behavior) {
				var remIndices = [];
				for (var i = 0; i < this.incidentModels.length; i++) {
					if (this.incidentModels[i].get('behaviorType') === behavior) {
						console.log('removing');
						dataService.removeBehaviorIncident(this.incidentModels[i]);
						remIndices.push(i);
					}
				}

				for (i = remIndices.length - 1; i >= 0; i--) {
					this.incidentModels.remove(remIndices[i]);
				}
			};

			this.toggleIncident = function(behavior) {
				if (this.incidentExists(behavior)) {
					this.removeIncident(behavior);
				}
				else {
					this.addIncident(behavior);
				}
			};

			this.incidentExists = function(behavior) {
				for (var i = 0; i < this.incidentModels.length; i++) {
					if (this.incidentModels[i].get('behaviorType') === behavior)
						return true;
				}
				return false;
			};
		}

		$scope.entryBuckets = dataService.getTimeRecordCollection().map(function(timeBucket) {
			return new EntryBucket(timeBucket);
		});
	};

	init();
});
