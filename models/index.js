import sequelize from '../lib/db.js';
import User from './user.model.js';
import Group from './group.model.js';
import Penalty from './penalty.model.js';
import Task from './task.model.js';
import UserGroupTask from './userGroupTask.model.js';
import RefreshToken from './refreshToken.model.js';

User.belongsToMany(Task, {through: UserGroupTask, onDelete: 'CASCADE', onUpdate: 'CASCADE'});
Task.belongsToMany(User, {through: UserGroupTask, onDelete: 'CASCADE', onUpdate: 'CASCADE'});

Group.hasMany(Task);
Task.belongsTo(Group);

User.belongsToMany(Group, {through: UserGroupTask, onDelete: 'CASCADE', onUpdate: 'CASCADE'});
Group.belongsToMany(User, {through: UserGroupTask, onDelete: 'CASCADE', onUpdate: 'CASCADE'});

User.hasOne(Penalty);
Penalty.belongsTo(User);


(async () => {
    try {
        await sequelize.sync({ alter: false });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to synchronize the models with the database:', error);
    }
})();

export {
    sequelize
};