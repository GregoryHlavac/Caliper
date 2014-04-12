module.exports = function(sequelize, types) 
{
    var Crash = sequelize.define('Crash',
	{
        signature: { type: types.STRING },
		first_appearance: { type: types.DATE, defaultValue: types.NOW }
	},
	{
		timestamps: false,
		classMethods:
		{
			associate: function(models) {
				Crash.belongsTo(models.Release);
				Crash.hasMany(models.Report);
			},
			assureSignature: function(release, sig, successCallback, errorCallback) {
				Crash.findOrCreate({ ReleaseId: release.id, signature: sig },{}).success(successCallback).error(errorCallback);
			}
		}
	});

	return Crash;
}