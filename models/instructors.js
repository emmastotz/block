module.exports = function(sequelize, DataType){
    var Instructor = sequelize.define("Instructor",{
        id: {
            type: DataType.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataType.STRING,
            unique: true,
            allowNull: false
        }
    });

    return Instructor;
};