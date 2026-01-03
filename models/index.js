import sequelize from "../lib/db.js";
import User from "./user.model.js";
import Group from "./group.model.js";
import Penalty from "./penalty.model.js";
import Task from "./task.model.js";
import UserGroupTask from "./userGroupTask.model.js";
import RefreshToken from "./refreshToken.model.js";
import Notification from "./notification.model.js";

User.belongsToMany(Task, {
  through: UserGroupTask,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  unique: false,
});
Task.belongsToMany(User, {
  through: UserGroupTask,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  unique: false,
});

Group.hasMany(Task, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Task.belongsTo(Group, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: "CASCADE",
});

User.belongsToMany(Group, {
  through: UserGroupTask,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  unique: false,
});
Group.belongsToMany(User, {
  through: UserGroupTask,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  unique: false,
});

User.hasMany(Penalty, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Penalty.belongsTo(User, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: "CASCADE",
});

Task.hasOne(Penalty, {
  foreignKey: {
    name: "TaskId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Penalty.belongsTo(Task, {
  foreignKey: {
    name: "TaskId",
    allowNull: false,
  },
});

Group.hasMany(Penalty, {
  foreignKey: {
    name: "GroupId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Penalty.belongsTo(Group, {
  foreignKey: {
    name: "GroupId",
    allowNull: false,
  },
});

User.hasMany(RefreshToken, {
  foreignKey: "UserId",
  onDelete: "SET NULL",
});

RefreshToken.belongsTo(User, {
  foreignKey: "UserId",
});

User.hasMany(Notification, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
});

Notification.belongsTo(User, {
  foreignKey: "UserId",
});

(async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to synchronize the models with the database:", error);
  }
})();

export { sequelize };
