app.controller('ScatterplotController', function($scope, dataService) {
	var init = function() {
		var fixedDayModel = dataService.getDayRecordCollection().models[0];

		var behaviorTypeCollection = dataService.getBehaviorTypeCollection();
		var behaviorIncidentCollection = dataService.getBehaviorIncidents();
		var timeRecordCollection = dataService.getTimeRecordCollection();

		function getIncidents(behaviorTypeId, timeRecordId, dayRecord) {
			var behaviorTypeModel = behaviorTypeCollection.get(behaviorTypeId);
			var timeRecordModel = timeRecordCollection.get(timeRecordId);
			if (!behaviorTypeModel || !timeRecordModel) {
				console.error('invalid ids. cannot get incidents')
			}		
			return behaviorIncidentCollection.where({time: timeRecordModel, day: fixedDayModel, behaviorType: behaviorTypeModel});
		}

		function Cell(dayRecordModel, timeBucketModel) {
			this.markers = [];
			// leave the cell blank if we're not trying to render the fixed day
			if (dayRecordModel) {
				behaviorTypeCollection.each(function(behaviorType) {
					var incidents = getIncidents(behaviorType.id, timeBucketModel.id, dayRecordModel)
					if (incidents.length > 0) {
						this.markers.push({
							behaviorTypeId: behaviorType.id,
							code: behaviorType.get('code'),
							count: incidents.length
						});
					}
				}, this);
			}
		}

		var options = behaviorTypeCollection.map(function(behaviorType) {
			return {
				id: behaviorType.id,
				label: behaviorType.get('name')
			};
		});

		
		$scope.behaviorTypes = [{id: '0', label: 'All Behaviors'}].concat(options);
		$scope.selectedBehaviorType = $scope.behaviorTypes[0];
		$scope.tallyMode = false;

		$scope.dayLabels = _.range(4,32);

		$scope.grid = []; // 2d array: [time][day]

		timeRecordCollection.each(function(timeRecord) {
			var row = {
				isoTimeString: timeRecord.get('iso_string'),
				cells: []
			};

			for (var i = 4; i < 32; i++) {
				var dayModel = i == 8 ? fixedDayModel: null;
				row.cells.push(new Cell(dayModel, timeRecord));
			}

			$scope.grid.push(row);
		});

		_scope = $scope;
	};

	init();
});
