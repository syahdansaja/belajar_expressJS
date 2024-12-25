import {DataTypes, Model} from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcryptjs"
import OTPRefresh from "./OTPRefresh.js";

class User extends Model {}
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull:false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING(13),
        allowNull: true,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    otpPassword: {
        type: DataTypes.STRING(6),
        allowNull: true
    },
    otpExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    otpVerifiedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},{
    tableName: "users",
    freezeTableName: true,
    sequelize,
    modelName: "User",
    hooks: {
        async beforeCreate(user, options) {
            user.createdAt = new Date();
            user.updatedAt = new Date();
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
        },
        async beforeUpdate(user, options) {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
            user.updatedAt = new Date();
        }
    }
});

export default User;