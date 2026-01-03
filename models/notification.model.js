import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM(
        "TASK_ASSIGNED",
        "TASK_COMPLETED",
        "TASK_OVERDUE",
        "PENALTY_RECEIVED",
        "GROUP_INVITE",
        "TASK_REMINDER"
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    relatedId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "ID của task, penalty, group liên quan",
    },
    relatedType: {
      type: DataTypes.ENUM("TASK", "PENALTY", "GROUP"),
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    updatedAt: false,
  }
);

export default Notification;
