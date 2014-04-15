module.exports = function(sequelize, types)
{
	var StackFrame = sequelize.define('StackFrame',
		{
			file: { type: types.STRING },
			frame: { type: types.INTEGER },
			function: { type: types.STRING(512) },
			function_offset: { type: types.STRING },
			line: { type: types.INTEGER },
			module: { type: types.STRING },
			module_offset: { type: types.STRING },
			offset: { type: types.STRING },
			trust: { type: types.STRING }
		},
		{
			timestamps: false,
			classMethods:
			{
				associate: function(models) {
					StackFrame.belongsTo(models.Report);
				},
				getByReport: function(rpt, successCallback, errorCallback) {
					StackFrame.findAll({ where: { ReportId: rpt.id }, order: '`frame` ASC'}).success(successCallback).error(errorCallback);
				}
			}
		});

	return StackFrame;
}