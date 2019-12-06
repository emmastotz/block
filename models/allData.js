module.exports = function(sequelize, DataTypes) {
  var AllData = sequelize.define("AllData", {
    subject_code: DataTypes.STRING,
    subject_name: DataTypes.STRING,
    number_title: DataTypes.STRING,
    sec: DataTypes.INTEGER,
    cr: DataTypes.INTEGER,
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME,
    day_code: DataTypes.STRING,
    inSchedule: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  });  

  AllData.associate = function(models) {
    AllData.belongsTo(models.Classes, { 
      foreignKey: "ClassId"
    })
  AllData.belongsTo(models.Subjects, { 
      foreignKey: "SubjectId"
    })
  };
  return AllData;
};