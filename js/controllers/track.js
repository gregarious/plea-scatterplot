Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

app.controller('TrackerController', function($scope, dataService) {
	var fixedDayModel = dataService.getDayRecordCollection().models[0];

	behaviorTypeCollection = dataService.getBehaviorTypeCollection();
	behaviorIncidentCollection = dataService.getBehaviorIncidents();
	timeRecordCollection = dataService.getTimeRecordCollection();

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
		this.isDisabled = false;
	}


	function getIncidents(behaviorTypeId, timeRecordId) {
		var behaviorTypeModel = behaviorTypeCollection.get(behaviorTypeId);
		var timeRecordModel = timeRecordCollection.get(timeRecordId);
		if (!behaviorTypeModel || !timeRecordModel) {
			console.error('invalid ids. cannot get incidents')
		}		
		return behaviorIncidentCollection.where({time: timeRecordModel, day: fixedDayModel, behaviorType: behaviorTypeModel});
	}

	function addIncident(behaviorTypeId, timeRecordId) {
		var behaviorTypeModel = behaviorTypeCollection.get(behaviorTypeId);
		var timeRecordModel = timeRecordCollection.get(timeRecordId);
		if (!behaviorTypeModel || !timeRecordModel) {
			console.error('invalid ids. cannot add incident')
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

	// this function is an artifact of bad design. get rid of after refactoring
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

		// determine which bucket is active at first
		$scope.activeBucket = null;
		var timeNow = '09:03';//moment().format('hh:mm');
		for (var i = 0; i < $scope.entryBuckets.length; ++i) {
			console.log(timeNow + ' >? ' + $scope.entryBuckets[i].isoTimeString);
			if (timeNow < $scope.entryBuckets[i].isoTimeString) {
				break;
			} 
			else {
				$scope.activeBucket = $scope.entryBuckets[i];
			}
		}

		$scope.setActiveBucket = function(entryBucket) {
			$scope.activeBucket = entryBucket;
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
		};
	}

	init();

	_glob = behaviorIncidentCollection;
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