app.controller('ScatterplotController', function($scope, dataService) {
	var init = function() {
		var incidentM2VM = function(model) {
			return {
				_model: model,
				behaviorCode: model.get('behaviorType').get('code'),
				cssClass: 'scatterplot-point-' + model.get('behaviorType').get('id')
			};
		};

		var allIncidents = dataService.getBehaviorIncidents();

		function Cell(dayRecordModel, timeBucketModel) {
			var incidentModels = allIncidents.where({
				day: dayRecordModel,
				time: timeBucketModel
			});
			this.behaviorTypeModels = _.map(incidentModels, function(model) {
				return model.get('behaviorType');
			});
		}

		function BehaviorTypeDisplay(behaviorTypeModel, show) {
			if (_.isUndefined(show)) {
				show = true;
			}
			this.show = show;
			this.model = behaviorTypeModel;
		}

		$scope.behaviorTypeCollection = dataService.getBehaviorTypeCollection();

		$scope.showBehaviorTypeStatus = {};
		$scope.behaviorTypeCollection.each(function(typeModel) {
			$scope.showBehaviorTypeStatus[typeModel.id] = true;
		});

		$scope.dayLabels = _.range(4,32);

		$scope.grid = []; // 2d array: [time][day]

		var fixedDayModel = dataService.getDayRecordCollection().models[0];

		dataService.getTimeRecordCollection().each(function(timeRecord) {
			var row = {
				time_string: timeRecord.get('iso_string'),
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
