module.exports = function(sequelize, DataTypes) {
    var Student = sequelize.define("Student", {
    email: DataTypes.STRING,
    password: DataTypes.STRING
    });
    return Student
};