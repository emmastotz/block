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
        },
        rating: {
            type: DataType.DECIMAL(10,2),
            unique: false,
            allowNull: true
        },
        difficulty: {
            type: DataType.DECIMAL(10,2),
            unique: false,
            allowNull: true
        },
        take_again_percent: {
            type: DataType.DECIMAL(10,2),
            unique: false,
            allowNull: true
        }
    });

    return Instructor;
};