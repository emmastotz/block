module.exports = function(sequelize, DataTypes) {
  var Classes = sequelize.define("Classes", {
    subject_name: DataTypes.STRING,
    class_name: DataTypes.STRING
  });

  Classes.associate = function(models) {
    Classes.hasMany(models.AllData, {})
    Classes.belongsTo(models.Subjects, { 
      foreignKey: "SubjectId"
    })
  };

  return Classes;
};