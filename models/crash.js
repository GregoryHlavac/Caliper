module.exports = function(sequelize, types) 
{
    var Crash = sequelize.define('Crash',
	{
        signature: { type: types.STRING },
		first_appearance: { type: types.DATE }
	},
	{
		timestamps: false,
		classMethods:
		{
			associate: function(models) {
				Crash.belongsTo(models.Release);
				Crash.hasMany(models.Report);
			}
		}
	});

	return Crash;
}