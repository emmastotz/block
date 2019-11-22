module.exports = function(sequelize, DataType){
    var User = sequelize.define("User",{
        id: {
            type: DataType.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataType.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataType.STRING,
            validate: {
                len: {
                    args:[1, 15],
                    msg: "Password must be between 1 and 15 characters"
                }
            }
        }
    });

    return User;
};