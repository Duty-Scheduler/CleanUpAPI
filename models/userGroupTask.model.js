import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';
import Penalty from './penalty.model.js';

const UserGroupTask  = sequelize.define('UserGroupTask', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    penalty_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    UserId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: false
    },
    GroupId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: false
    },
    TaskId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: false
    }
    }, {
    indexes: [
        {
        unique: true,
        fields: ["UserId", "GroupId", "TaskId"]
        }
    ]
});



export default UserGroupTask ;