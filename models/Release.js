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
			}
		}
	});

	return Release;
}