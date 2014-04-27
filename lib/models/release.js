module.exports = function(sequelize, types) 
{
	var Release = sequelize.define('Release',
	{
		version: { type: types.STRING, unique: true },
		nickname: { type: types.STRING },
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
				Release
					.findAll({
						where: { ProjectId: pid },
						limit: count,
						order: '`version` DESC'
					}).success(successCallback).error(errorCallback);
			},
			getLimitedOffsetBy: function(pid, count, offsetBy, successCallback, errorCallback) {
				Release
					.findAll({
						where: { ProjectId: pid },
						limit: count,
						offset: offsetBy,
						order: '`version` DESC'
					}).success(successCallback).error(errorCallback);
			},
			hasVersion: function(project, vers, successCallback, errorCallback) {
				Release.find({ where: { version: vers, ProjectId: project.id }}).success(successCallback).error(errorCallback);
			},
			assureVersion: function(project, vers, successCallback, errorCallback) {
				Release.findOrCreate(
					{
						ProjectId: project.id, version: vers
					},
					{
						unidentified_crashes: 0,
						identified_crashes: 0,
						fixed_crashes: 0
					}).success(successCallback).error(errorCallback);
			}
		}
	});

	return Release;
}