import {DataTypes, Model} from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

class OTPRefresh extends Model {}
OTPRefresh.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    OTPPassword: {
        type: DataTypes.STRING(6),
        allowNull: false
    },
    expiredAt: {
        type:DataTypes.DATE,
        allowNull: false
    },
    verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    createdAt: {
        type:DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type:DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: "OTPRefresh_passwords",
    freezeTableName: true,
    sequelize,
    modelName: "OTPRefresh",
    // model hooks
    hooks: {
        beforeCreate(OTPPassword, options) {
            OTPPassword.createdAt = new Date(Date.now());
        },
        beforeUpdate(OTPPassword, options) {
            OTPPassword.updatedAt = new Date(Date.now());
        }
    }
});
// Relation define
OTPRefresh.belongsTo(User, {
    foreignKey: {
        name: "userId"
    }
})
export default OTPRefresh;