module.exports = function(sequelize, DataTypes) {
    var savedSchedules = sequelize.define(
        "savedSchedules", 
        {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    });
      
    savedSchedules.associate = function(models) {
        savedSchedules.belongsTo(models.User, {
            foreignKey: "user_id"
        });
    };

    return savedSchedules;
  };