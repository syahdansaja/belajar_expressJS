import {DataTypes, Model} from "sequelize";
import sequelize from "../config/database.js";

class User extends Model {}
User.init(
    {
        uuid: {
            type: DataTypes.UUID,
            length: 16,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "User"
    }
)
User.addHook('beforeSave', async (user, options) => {

})