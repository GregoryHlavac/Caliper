module.exports = function(sequelize, types)
{
	var Report = sequelize.define('Report',
		{
			client_id: { type: types.STRING },
			operating_system: { type: types.STRING },
			reported_on: { type: types.DATE },
			minidump_id: { type: types.STRING, unique: true },
			description: { type: types.STRING }
		},
		{
			timestamps: false,
			classMethods:
			{
				associate: function(models) {
					Report.belongsTo(models.Crash);
				}
			}
		});

	return Report;
}