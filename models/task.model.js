import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    proof: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    penalty_description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

export default Task;