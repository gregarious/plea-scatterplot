app.service('dataService', function() {
	var testInit = function() {
		var anchor = moment(new Date(2013, 1, 1, 8, 30));
		var end = moment(new Date(2013, 1, 1, 14, 31));

		var timeBuckets = [];
		var ctr = 1;
		while(anchor < end) {
			timeBuckets.push({
				'id': ctr++,
				'iso_string': anchor.format('hh:mm')
			});
			anchor.add('minutes', 15);
		}

		var behaviorTypes = [
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
		];

		var behaviorIncidents = [
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
		];

		return {
			timeBuckets: timeBuckets,
			behaviorTypes: behaviorTypes,
			behaviorIncidents: behaviorIncidents
		};
	};

	var _data = testInit();

	this.getTimeBuckets = function() {
		return _data.timeBuckets;
	};

	this.getBehaviorTypes = function() {
		return _.map(_data.behaviorTypes, function(bType) {
			return _.extend(_.clone(bType), {
				// TODO: shouldn't be defining css classes in service, move out during refactor
				cssClass: 'behavior-key-item-' + bType.id
			});
		});
	};

	this.getIncidentsInBucket = function(timeBucketId) {
		var records = _.filter(_data.behaviorIncidents, function(record) {
			return record.timeBucketId === timeBucketId;
		});

		var incidents = _.map(records, function(record) {
			return {
				// TODO: shouldn't be defining css classes in service, move out during refactor
				cssClass: 'behavior-incident-' + record.behaviorTypeId,
				behaviorType: _data.behaviorTypes[record.behaviorTypeId-1]
			};
		});
		return incidents;
	};
});
