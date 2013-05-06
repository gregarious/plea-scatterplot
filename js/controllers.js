app.controller('TrackerController', function($scope, dataService) {
	var day = dataService.getDayRecordCollection().models[0];

	var init = function() {
		$scope.currentDay = {
			_model: day,
			label: 'Today'
		};

		$scope.behaviors = dataService.getBehaviorTypeCollection().map(behaviorM2VM);
		var allIncidents = dataService.getBehaviorIncidents();
		$scope.timeBuckets = dataService.getTimeRecordCollection().map(function(model) {
			return {
				_bucketId: model.id,
				timeRecord: timeRecordM2VM(model),
				incidents: _.map(allIncidents.where({time: model, day: day}), incidentM2VM)
			};
		});
	};

	var timeRecordM2VM = function(model) {
		return {
			_model: model,
			iso_string: model.get('iso_string')
		};
	};

	var incidentM2VM = function(model) {
		return {
			_model: model,
			behaviorCode: model.get('behaviorType').get('code'),
			cssClass: 'behavior-incident-' + model.get('behaviorType').get('id')
		};
	};

	var behaviorM2VM = function(model) {
		return {
			_model: model,
			code: model.get('code'),
			name: model.get('name'),
			cssClass: 'behavior-key-item-' + model.get('id')
		};
	};

	$scope.addBehaviorIncident = function(behaviorTypeId, timeBucketId) {
		var timeRecordId = timeBucketId;
		behaviorTypeId = Math.floor(Math.random() * 3)+1;
		var newIncident = dataService.addBehaviorIncident(behaviorTypeId, day.id, timeRecordId);
		bucket = _.where($scope.timeBuckets, {_bucketId: timeBucketId});
		if (bucket.length)  {
			bucket[0].incidents.push(incidentM2VM(newIncident));
		}
	};

	init();
});


app.controller('ScatterplotController', function($scope, dataService) {
	var init = function() {
		$scope.grid = []; // 2d array: [time][day]
		var incidents = dataService.getBehaviorIncidents();
		var row;

		var incidentM2VM = function(model) {
			return {
				_model: model,
				behaviorCode: model.get('behaviorType').get('code'),
				cssClass: 'scatterplot-point-' + model.get('behaviorType').get('id')
			};
		};

		dataService.getTimeRecordCollection().each(function(timeRecord) {
			row = {
				time_string: timeRecord.get('iso_string'),
				cells: []
			};
			for (var i = 1; i <= 4; i++) { row.cells.push([]); }
			row.cells.push(_.map(incidents.where({
				time: timeRecord
			}), incidentM2VM));
			for (i = 6; i <= 14; i++) { row.cells.push([]); }
			$scope.grid.push(row);
		});
	};

	init();
});

app.controller('ManageController', function($scope, dataService) {
	var init = function() {
		$scope.behaviors = dataService.getBehaviorTypeCollection().map(behaviorM2VM);
	};

	var behaviorM2VM = function(model) {
		return {
			_model: model,
			code: model.get('code'),
			name: model.get('name'),
			cssClass: 'behavior-key-item-' + model.get('id')
		};
	};

	init();
});