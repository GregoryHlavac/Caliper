module.exports = function(sequelize, types) 
{
	var Release = sequelize.define('Release',
	{
		version: { type: types.STRING, unique: true },
		first_crash: { type: types.DATE, unique: true }    
	},
	{
		classMethods:
		{
			associate: function(models) {
				Release.hasMany(models.Crash);
			}
		}
	});

	return Release;
}