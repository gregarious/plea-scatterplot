
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