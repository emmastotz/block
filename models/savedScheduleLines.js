module.exports = function(sequelize, DataTypes) {
    var savedSchedulesLines = sequelize.define(
        "savedSchedulesLines", 
        {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    });
      
    savedSchedulesLines.associate = function(models) {
        savedSchedulesLines.belongsTo(models.savedSchedules, {
            foreignKey: "saved_schedules_id"
        });

        savedSchedulesLines.belongsTo(models.AllData, {
            foreignKey: "alldata_id"
        });
        
    };

    return savedSchedulesLines;
};