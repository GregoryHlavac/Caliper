module.exports = function(sequelize, DataTypes) {
	return sequelize.define("Release", 
	{
    	version: { type: DataTypes.STRING, unique: true }
	})
}