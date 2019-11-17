module.exports = function(sequelize, DataTypes) {
  var Subjects = sequelize.define("Subjects", {
    subject_name: DataTypes.STRING
  });
    
  Subjects.associate = function(models) {
    Subjects.hasMany(models.AllData, {});
    Subjects.hasMany(models.Classes, {});
  };
  return Subjects;
};