module.exports = function(sequelize, types) 
{
    var Crash = sequelize.define('Crash',
	{
		client_id: { type: types.STRING },
        crash_id: { type: types.STRING }
	},
	{
		classMethods:
		{
			associate: function(models) {
				Crash.belongsTo(models.Release);
			}
		}
	});

	return Crash;
}