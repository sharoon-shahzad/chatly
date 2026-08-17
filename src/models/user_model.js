import { table, timeStamp } from 'node:console';
import { type } from 'node:os';
import sequelize from 'sequelize';
import { DataTypes } from 'sequelize';

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        required: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        required: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,

    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},
    {
        tableName: 'users', // Specify the table name explicitly
        timestamps: true, // Enable timestamps (createdAt and updatedAt)
        createdAt: 'created_at', // Customize the name of the createdAt column


    });