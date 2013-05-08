app.controller('ManageController', function($scope, dataService) {
	var init = function() {
		$scope.behaviorCollection = dataService.getBehaviorTypeCollection();
		$scope.addBehaviorType = function() {
			dataService.addBehaviorType();
		};
	};

	init();
});