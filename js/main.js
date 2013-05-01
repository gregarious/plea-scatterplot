var app = angular.module('app', []);

app.factory('testData', function() {
	var anchor = moment(new Date(2013, 1, 1, 8, 30));
	var end = moment(new Date(2013, 1, 1, 14, 31));

	var timeRecords = [];
	var ctr = 1;
	while(anchor < end) {
		timeRecords.push({
			'id': ctr++,
			'iso_string': anchor.format('hh:mm')
		});
		anchor.add('minutes', 15);
	}

	return {
		timeRecords: timeRecords,

		behaviorTypes: [
			{
				id: 1,
				code: 'P',
				name: 'Pinch'
			},
			{
				id: 2,
				code: 'HS',
				name: 'Happy Slap'
			},
			{
				id: 3,
				code: 'L',
				name: 'Language'
			}
		],

		behaviorRecords: [
			{
				behaviorTypeId: 1,
				timeBucketId: 1,
				recorded_at: '2013-04-30T08:34:30.652Z'
			},
			{
				behaviorTypeId: 2,
				timeBucketId: 1,
				recorded_at: '2013-04-30T08:34:37.652Z'
			},
			{
				behaviorTypeId: 2,
				timeBucketId: 2,
				recorded_at: '2013-04-30T08:34:37.652Z'
			},
			{
				behaviorTypeId: 3,
				timeBucketId: 3,
				recorded_at: '2013-04-30T08:34:37.652Z'
			}
		]
	};
});

app.controller('TrackerController', function($scope, testData) {
	$scope.timeRecords = testData.timeRecords;
	$scope.behaviorRecords = [
		testData.behaviorRecords.slice(0,2),
		testData.behaviorRecords.slice(2,3),
		testData.behaviorRecords.slice(3,4)
	];
	$scope.behaviorTypes = testData.behaviorTypes;


});