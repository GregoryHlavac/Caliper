module.exports = function(sequelize, types)
{
	var Backlog = sequelize.define('Backlog',
		{
			// Preserved fields from original submit.
			report_uuid: { type: types.STRING },
			client_id: { type: types.STRING },
			description: { type: types.STRING },
			version: { type: types.STRING },

			// Backlog Details for Re-Parse and Such.
			local_file: { type: types.STRING },
			missing_module: { type: types.STRING },
			module_identifier: { type: types.STRING }
		},
		{
			timestamps: false,
			classMethods:
			{
				associate: function(models) {
					Backlog.belongsTo(models.Project);
				}
			}
		});

	return Backlog;
}