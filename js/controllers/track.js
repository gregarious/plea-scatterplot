Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

app.controller('TrackerController', function($scope, dataService) {
	var fixedDayModel = dataService.getDayRecordCollection().models[0];

	var behaviorTypeCollection = dataService.getBehaviorTypeCollection();
	var behaviorIncidentCollection = dataService.getBehaviorIncidents();
	var timeRecordCollection = dataService.getTimeRecordCollection();

	// view model functions
	function EntryBucket(timeRecord, behaviorTypes, behaviorIncidents) {
		this.timeRecordId = timeRecord.id;
		this.isoTimeString = timeRecord.get('iso_string');
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
		this.isDepressed = false;
	}

	/*** NOTE: these next 4 functions are a bit verbose, mostly as a result of there
		being a complete separation between the Backbone-based model layer and the 
		scope viewmodel Javascript objects.

		Once this interface is refactored, the amount of boilerplate and 
		explicitness of these functions will hopefully not be necessary anymore.
	***/

	function getIncidents(behaviorTypeId, timeRecordId) {
		var behaviorTypeModel = behaviorTypeCollection.get(behaviorTypeId);
		var timeRecordModel = timeRecordCollection.get(timeRecordId);
		if (!behaviorTypeModel || !timeRecordModel) {
			console.error('invalid ids. cannot get incidents');
		}
		return behaviorIncidentCollection.where({time: timeRecordModel, day: fixedDayModel, behaviorType: behaviorTypeModel});
	}

	function addIncident(behaviorTypeId, timeRecordId) {
		var behaviorTypeModel = behaviorTypeCollection.get(behaviorTypeId);
		var timeRecordModel = timeRecordCollection.get(timeRecordId);
		if (!behaviorTypeModel || !timeRecordModel) {
			console.error('invalid ids. cannot add incident');
		}
		var newIncidentModel = dataService.addBehaviorIncident(
			behaviorTypeModel, fixedDayModel, timeRecordModel);

		var marker = $scope.activeBucket.markers[behaviorTypeId];
		if (!marker) {
			marker = new BucketMarker(bType);
		}
		marker.count++;
	}

	function removeIncident(behaviorTypeId, timeRecordId) {
		var incidents = getIncidents(behaviorTypeId, timeRecordId);
		if (incidents.length > 0) {
			dataService.removeBehaviorIncident(incidents[0]);
		}

		var marker = $scope.activeBucket.markers[behaviorTypeId];
		if (marker) {
			marker.count--;
		}
	}

	function getEntryBucketForTimeId(timeRecordId) {
		var matches = _.where($scope.entryBuckets, {timeRecordId: timeRecordId});
		if (matches.length > 0) {
			return matches[0];
		}
		else {
			return null;
		}
	}

	function init() {
		$scope.currentDay = {
			label: 'Today'
		};

		$scope.behaviorButtons = _.map(behaviorTypeCollection.models, function(behaviorTypeModel) {
			return new BehaviorButton(behaviorTypeModel);
		});

		$scope.entryBuckets = _.map(timeRecordCollection.models, function(timeRecordModel) {
			return new EntryBucket(timeRecordModel,
				behaviorTypeCollection.models,
				behaviorIncidentCollection.where({time: timeRecordModel, day: fixedDayModel})
			);
		});

		$scope.setActiveBucket = function(entryBucket) {
			$scope.activeBucket = entryBucket;

			// NOTE: This could use some refactoring. Not declarative at all.
			_.each($scope.behaviorButtons, function(button) {
				button.isDepressed = false;
				if ($scope.activeBucket) {
					var incidents = getIncidents(button.behaviorTypeId, $scope.activeBucket.timeRecordId);
					if (incidents.length > 0 && !button.tallyMode) {
						button.isDepressed = true;
					}
				}
			});
		};

		$scope.behaviorTapped = function(behaviorTypeId) {
			if (!$scope.activeBucket) {
				console.error('No displayed time bucket is active.');
				return;
			}

			var behaviorTypeModel = behaviorTypeCollection.get(behaviorTypeId);
			var timeRecordId = $scope.activeBucket.timeRecordId;
			if (behaviorTypeModel.get('tallyMode') || getIncidents(behaviorTypeId, timeRecordId).length === 0) {
				addIncident(behaviorTypeId, timeRecordId);
			}
			else {
				removeIncident(behaviorTypeId, timeRecordId);
			}

			_.each($scope.behaviorButtons, function(button) {
				button.isDepressed = false;
				if ($scope.activeBucket) {
					var incidents = getIncidents(button.behaviorTypeId, $scope.activeBucket.timeRecordId);
					if (incidents.length > 0 && !button.tallyMode) {
						button.isDepressed = true;
					}
				}
			});
		};

		// determine which bucket is active at first
		var initialActiveBucket = null;
		var timeNow = '09:03';//moment().format('hh:mm');
		for (var i = 0; i < $scope.entryBuckets.length; ++i) {
			if (timeNow < $scope.entryBuckets[i].isoTimeString) {
				break;
			}
			else {
				initialActiveBucket = $scope.entryBuckets[i];
			}
		}
		if (initialActiveBucket) {
			$scope.setActiveBucket(initialActiveBucket);
		}

	}

	init();
});
