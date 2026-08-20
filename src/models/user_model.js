import { DataTypes } from "sequelize";
import { sequelize } from "../db/config.js";
import jwt from "jsonwebtoken";

const User = sequelize.define(
    "User",
    {
        user_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        refresh_token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "users",
        // hooks: {
        //     beforeSave: async (User) => {
        //         if (User.changed("password")) {
        //             const salt = await bcrypt.genSalt(10);
        //             User.password = await bcrypt.hash(User.password, salt);
        //         }
        //     },
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        // }
    }
);
User.prototype.generateAccessToken = async function () {
    return jwt.sign({
        user_id: this.user_id,
        email: this.email,
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });
}
User.prototype.generateRefreshToken = async function () {
    return jwt.sign({
        user_id: this.user_id,
        email: this.email,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    });

}

export default User;