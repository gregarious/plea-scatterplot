app.service('dataService', function() {

	var DayRecord = Backbone.RelationalModel.extend({});
	var TimeRecord = Backbone.RelationalModel.extend({});
	var BehaviorType = Backbone.RelationalModel.extend({});
	var BehaviorIncident = Backbone.RelationalModel.extend({
		relations: [{
			type: Backbone.HasOne,
			key: 'day',
			relatedModel: DayRecord
		},
		{
			type: Backbone.HasOne,
			key: 'time',
			relatedModel: TimeRecord
		},
		{
			type: Backbone.HasOne,
			key: 'behaviorType',
			relatedModel: BehaviorType
		}],
		sync: function(method, model, options) {
			Backbone.RelationalModel.prototype.sync.apply(this, arguments);
		}
	});

	var DayRecordCollection = Backbone.Collection.extend({model: DayRecord});
	var TimeRecordCollection = Backbone.Collection.extend({model: TimeRecord});
	var BehaviorTypeCollection = Backbone.Collection.extend({model: BehaviorType});
	var BehaviorIncidentCollection = Backbone.Collection.extend({
		model: BehaviorIncident,
		url: '/api/incident',
		parse: function(response) {
			return response.results;
		},
		localStorage: new Backbone.LocalStorage("BehaviorIncidents")
	});

	var testInit = function() {
		var anchor = moment(new Date(2013, 1, 1, 8, 30));
		var end = moment(new Date(2013, 1, 1, 14, 31));

		var timeObjs = [];
		var ctr = 1;
		while(anchor < end) {
			timeObjs.push({
				'id': ctr++,
				'iso_string': anchor.format('hh:mm')
			});
			anchor.add('minutes', 15);
		}

		var timeRecords = new TimeRecordCollection(timeObjs);
		var dayRecords = new DayRecordCollection([
			{
				iso_string: '2013-05-01'
			}
		]);
		var behaviorTypes = new BehaviorTypeCollection([
			{
				id: '1',
				code: 'P',
				name: 'Pinch'
			},
			{
				id: '2',
				code: 'HS',
				name: 'Happy Slap'
			},
			{
				id: '3',
				code: 'L',
				name: 'Language'
			}
		]);

		var behaviorIncidents = new BehaviorIncidentCollection([
			{
				behaviorType: behaviorTypes.findWhere({code: 'P'}),
				time: timeRecords.findWhere({iso_string: '08:30'}),
				day: dayRecords.findWhere({iso_string: '2013-05-01'}),
				recorded_at: '2013-04-30T08:34:30.652Z'
			},
			{
				behaviorType: behaviorTypes.findWhere({code: 'L'}),
				time: timeRecords.findWhere({iso_string: '08:30'}),
				day: dayRecords.findWhere({iso_string: '2013-05-01'}),
				recorded_at: '2013-04-30T08:34:37.652Z'
			},
			{
				behaviorType: behaviorTypes.findWhere({code: 'HS'}),
				time: timeRecords.findWhere({iso_string: '08:45'}),
				day: dayRecords.findWhere({iso_string: '2013-05-01'}),
				recorded_at: '2013-04-30T08:34:37.652Z'
			},
			{
				behaviorType: behaviorTypes.findWhere({code: 'L'}),
				time: timeRecords.findWhere({iso_string: '09:00'}),
				day: dayRecords.findWhere({iso_string: '2013-05-01'}),
				recorded_at: '2013-04-30T08:34:37.652Z'
			}
		]);

		return {
			timeRecords: timeRecords,
			dayRecords: dayRecords,
			behaviorTypes: behaviorTypes,
			behaviorIncidents: behaviorIncidents
		};
	};

	_data = testInit();

	this.getTimeRecordCollection = function() {
		return _data.timeRecords;
	};

	this.getDayRecordCollection = function() {
		return _data.dayRecords;
	};

	this.getBehaviorTypeCollection = function() {
		return _data.behaviorTypes;
	};

	this.getBehaviorIncidents = function() {
		return _data.behaviorIncidents;
	};

	this.addBehaviorIncident = function(typeId, dayId, timeId) {
		return this.getBehaviorIncidents().create({
			behaviorType: typeId,
			time: timeId,
			day: dayId
		});
	};
});
