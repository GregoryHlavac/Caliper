module.exports = function(sequelize, types) 
{
	var Release = sequelize.define('Release',
	{
		version: { type: types.STRING, unique: true },
		unidentified_crashes: { type: types.INTEGER },
		identified_crashes: { type: types.INTEGER },
		fixed_crashes: { type: types.INTEGER }
	},
	{
		timestamps: false,
		classMethods:
		{
			associate: function(models) {
				Release.hasMany(models.Crash);
				Release.belongsTo(models.Project);
			},
			getLimited: function(pid, count, successCallback, errorCallback) {
				db.Release
					.findAll({
						where: { ProjectId: pid },
						limit: count,
						order: '`version` DESC'
					}).success(successCallback).error(errorCallback);
			},
			getLimitedOffsetBy: function(pid, count, offsetBy, successCallback, errorCallback) {
				db.Release
					.findAll({
						where: { ProjectId: pid },
						limit: count,
						offset: offsetBy,
						order: '`version` DESC'
					}).success(successCallback).error(errorCallback);
			}
		}
	});

	return Release;
}