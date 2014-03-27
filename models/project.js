module.exports = function(sequelize, types)
{
	var Project = sequelize.define('Project',
		{
			title: { type: types.STRING, unique: true }
		},
		{
			timestamps: false,
			classMethods:
			{
				associate: function(models) {
					Project.hasMany(models.Release);
				}
			}
		});

	return Project;
}