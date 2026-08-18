import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/config.js';

const Message = sequelize.define('Message', {
    mssg_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    content: {
        type: DataTypes.TEXT,
        required: true,
        allowNull: false
    },
}, {
    tableName: 'messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});
export default Message;