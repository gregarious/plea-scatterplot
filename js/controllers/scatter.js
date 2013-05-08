app.controller('ScatterplotController', function($scope, dataService) {
	var init = function() {
		var incidentM2VM = function(model) {
			return {
				_model: model,
				behaviorCode: model.get('behaviorType').get('code'),
				cssClass: 'scatterplot-point-' + model.get('behaviorType').get('id')
			};
		};

		$scope.behaviorTypes = {};
		dataService.getBehaviorTypeCollection().each(function(model) {
			console.log(model);
			$scope.behaviorTypes[model.get('code')] = {
				code: model.get('code'),
				show: true
			};
		});

		console.log($scope.behaviorTypes);

		$scope.dayLabels = [
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"10",
			"11",
			"12",
			"13",
			"14",
			"15",
			"16",
			"17",
			"18",
			"19",
			"20",
			"21",
			"22",
			"23",
			"24",
			"25",
			"26",
			"27",
			"28",
			"29",
			"30",
			"31"
		];

		$scope.grid = []; // 2d array: [time][day]
		var incidents = dataService.getBehaviorIncidents();
		var row;

		dataService.getTimeRecordCollection().each(function(timeRecord) {
			row = {
				time_string: timeRecord.get('iso_string'),
				cells: []
			};
			for (var i = 1; i <= 4; i++) { row.cells.push([]); }
			row.cells.push(_.map(incidents.where({
				time: timeRecord
			}), incidentM2VM));
			for (i = 6; i <= 28; i++) { row.cells.push([]); }
			$scope.grid.push(row);
		});
	};

	init();
});
