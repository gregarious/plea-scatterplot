Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

app.controller('TrackerController', function($scope, dataService) {
	var fixedDayModel = dataService.getDayRecordCollection().models[0];

	// view model functions
	function EntryBucket(timeRecord, behaviorTypes, behaviorIncidents) {
		this.active = false;
		this.time_string = timeRecord.get('iso_string');
		this.markers = {};

		// create markers for each behavior type
		_.each(behaviorTypes, function(bType) {
			this.markers[bType.id] = new BucketMarker(bType);
		}, this);

		// compile counts for all incidents of each type
		_.each(behaviorIncidents, function(bIncident) {
			var marker = this.markers[bIncident.get('behaviorType').id];
			if (marker) {
				marker.count++;
			}
		}, this);
	}

	function BucketMarker(behaviorType) {
		this.code = behaviorType.get('code');
		this.behaviorTypeId = behaviorType.id;
		this.count = 0;
		this.tallyMode = behaviorType.get('tallyMode');
	}

	function BehaviorButton(behaviorType) {
		this.code = behaviorType.get('code');
		this.name = behaviorType.get('name');
		this.tallyMode = behaviorType.get('tallyMode');
		this.behaviorTypeId = behaviorType.id;
		this.isDisabled = false;
		this.onTap = function() {
			console.log('tapped behavior ' + this.code);
		};
	}

	function init() {
		$scope.currentDay = {
			label: 'Today'
		};

		var behaviorTypeCollection = dataService.getBehaviorTypeCollection();
		var behaviorIncidentCollection = dataService.getBehaviorIncidents();
		var timeRecordCollection = dataService.getTimeRecordCollection();

		$scope.behaviorButtons = _.map(behaviorTypeCollection.models, function(behaviorTypeModel) {
			return new BehaviorButton(behaviorTypeModel);
		});

		$scope.entryBuckets = _.map(timeRecordCollection.models, function(timeRecordModel) {
			return new EntryBucket(timeRecordModel,
				behaviorTypeCollection.models,
				behaviorIncidentCollection.where({time: timeRecordModel, day: fixedDayModel})
			);
		});
	}

	init();

	_glob = $scope;
});

		// /*
		//  * EntryBucket class
		//  */
		// function EntryBucket(timeBucketModel) {
		// 	this.timeBucketModel = timeBucketModel;
		// 	this.incidentModels = allIncidents.where({time: timeBucketModel, day: fixedDayModel});

		// 	this.addIncident = function(behaviorTypeModel) {
		// 		var newIncidentModel = dataService.addBehaviorIncident(
		// 			behaviorTypeModel,
		// 			fixedDayModel,
		// 			this.timeBucketModel
		// 		);

		// 		// TODO: manual binding happening here. consider using BB binding to update this automatically?
		// 		this.incidentModels.push(newIncidentModel);

		// 		return newIncidentModel;
		// 	};

		// 	this.removeIncident = function(behavior) {
		// 		var remIndices = [];
		// 		for (var i = 0; i < this.incidentModels.length; i++) {
		// 			if (this.incidentModels[i].get('behaviorType') === behavior) {
		// 				console.log('removing');
		// 				dataService.removeBehaviorIncident(this.incidentModels[i]);
		// 				remIndices.push(i);
		// 			}
		// 		}

		// 		for (i = remIndices.length - 1; i >= 0; i--) {
		// 			this.incidentModels.remove(remIndices[i]);
		// 		}
		// 	};

		// 	this.toggleIncident = function(behavior) {
		// 		if (this.incidentExists(behavior)) {
		// 			this.removeIncident(behavior);
		// 		}
		// 		else {
		// 			this.addIncident(behavior);
		// 		}
		// 	};

		// 	this.incidentExists = function(behavior) {
		// 		for (var i = 0; i < this.incidentModels.length; i++) {
		// 			if (this.incidentModels[i].get('behaviorType') === behavior)
		// 				return true;
		// 		}
		// 		return false;
		// 	};
		// }

		// $scope.entryBuckets = dataService.getTimeRecordCollection().map(function(timeBucket) {
		// 	return new EntryBucket(timeBucket);
		// });
	// };