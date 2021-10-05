export default (sequelize, DataTypes) => {
    const Board = sequelize.define("permission", {
            title: {
            type: DataTypes.STRING,
            allowNull: false
            },
            level : {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            desc: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        });
        Board.associate = function(models) {
            models.Board.belongsTo(models.User);
        };
    return Permission;
    };