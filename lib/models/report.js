var lodash = require('lodash');

module.exports = function(sequelize, types)
{
	var Report = sequelize.define('Report',
		{
			report_uuid: { type: types.STRING, unique: true },
			client_id: { type: types.STRING },
			description: { type: types.STRING },
			crash_type: { type: types.STRING },
			operating_system: { type: types.STRING },
			os_version: { type: types.STRING },
			reported_on: { type: types.DATE, defaultValue: types.NOW }
		},
		{
			timestamps: false,
			classMethods:
			{
				associate: function(models) {
					Report
						.belongsTo(models.Crash)
						.hasMany(models.StackFrame);
				},
				assureReport: function(db, crash, uuid, clientID, desc, minidumpData, successCallback, errorCallback) {
					Report.findOrCreate(
						{
							CrashId: crash.id,
							report_uuid: uuid
						},
						{
							client_id: clientID,
							description: desc,
							crash_type: minidumpData.crash_info.type,
							operating_system: minidumpData.system_info.os,
							os_version: minidumpData.system_info.os_ver
						}).success(function(rpt) {
							minidumpData.crashing_thread.frames.forEach(function(frame) {
								db.StackFrame.create(frame).success(function(sf) {
									rpt.addStackFrame(sf);
								});
							});

							successCallback(rpt);
						}).error(function(err) {
							errorCallback(err);
						});
				},
				assureBacklogged: function(db, crash, uuid, clientID, desc, minidumpData, successCallback, errorCallback) {

				}
			}
		});

	return Report;
}