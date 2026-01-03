import Group from "../models/group.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import sequelize from "../lib/db.js";
import { isGroupAdmin, isUserAssignedToTask } from "../lib/authorization.js";
import UserGroupTask from "../models/userGroupTask.model.js";
import cloudinary from "../lib/cloudinary.js";
import { createNotification } from "./notification.controller.js";

export const getAllTaskInGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const tasks = await Task.findAll({
      where: { GroupId: groupId },
      attributes: ["id", "title", "description", "status", "proof"],
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "avatar"],
          through: {
            attributes: ["penalty_status"],
          },
        },
      ],
    });

    return res.status(200).json({
      groupId,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getMyTasks = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const tasks = await Task.findAll({
      attributes: ["id", "title", "description", "status", "proof"],
      include: [
        {
          model: User,
          where: { id: user.id },
          attributes: [],
          through: {
            attributes: ["penalty_status"],
          },
        },
        {
          model: Group,
          attributes: ["id", "title"],
        },
      ],
    });
    // const formattedTasks = tasks.map(task => ({
    //   id: task.id,
    //   title: task.title,
    //   description: task.description,
    //   status: task.status,
    //   proof: task.proof,
    //   group: task.Group,
    //   penalty_status: task.Users[0].UserGroupTask.penalty_status
    // }));

    return res.status(200).json({
      userId: user.id,
      total: tasks.length,
      tasks: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const createTask = async (req, res) => {
  const user = req.user;
  const { groupId } = req.params;
  const { title, description, penalty_description, assignId } = req.body;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (
    !title ||
    !description ||
    !penalty_description ||
    !Array.isArray(assignId) ||
    assignId.length === 0
  ) {
    return res.status(400).json({ message: "Missing or invalid parameter" });
  }

  const isAdmin = await isGroupAdmin(user.id, groupId);
  if (!isAdmin) {
    return res.status(403).json({ message: "Forbidden: Admin only" });
  }

  const transaction = await sequelize.transaction();

  try {
    // 1. Tạo task
    const task = await Task.create(
      {
        title,
        description,
        penalty_description,
        GroupId: groupId,
      },
      { transaction }
    );
    // 2. Gán task cho nhiều user
    const userGroupTasks = assignId.map((userId) => ({
      UserId: userId,
      GroupId: groupId,
      TaskId: task.id,
    }));

    await UserGroupTask.bulkCreate(userGroupTasks, { transaction });
    // 3. Commit
    await transaction.commit();

    // 4. Gửi thông báo cho các user được gán task
    for (const userId of assignId) {
      await createNotification(
        userId,
        "TASK_ASSIGNED",
        "Task mới được gán",
        `Bạn được gán task: ${title}`,
        task.id,
        "TASK"
      );
    }

    return res.status(201).json({
      message: "Task created",
      task,
    });
  } catch (error) {
    // 4. Rollback
    await transaction.rollback();

    console.error("Sequelize error:", error);
    console.error("Errors:", error.errors);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.errors?.map((e) => e.message) || error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  const user = req.user;
  const { taskId } = req.params;
  const { title, description, status } = req.body;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAdmin = await isGroupAdmin(user.id, task.GroupId);
    if (!isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }

    const updatePayload = {};

    if (title !== undefined) updatePayload.title = title;
    if (description !== undefined) updatePayload.description = description;
    if (status !== undefined) updatePayload.status = status;

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for update",
      });
    }

    await task.update(updatePayload);

    // Gửi thông báo nếu task được hoàn thành
    if (status === "completed") {
      const assignedUsers = await task.getUsers();
      for (const assignedUser of assignedUsers) {
        await createNotification(
          assignedUser.id,
          "TASK_COMPLETED",
          "Task đã hoàn thành",
          `Task "${task.title}" đã được đánh dấu hoàn thành`,
          task.id,
          "TASK"
        );
      }
    }

    return res.status(200).json({
      message: "Task updated",
      task,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  const user = req.user;
  const { taskId } = req.params;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAdmin = await isGroupAdmin(user.id, task.GroupId);
    if (!isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }

    await task.destroy();

    return res.status(200).json({
      message: "Task deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const uploadProof = async (req, res) => {
  const { taskId } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }

  if (!taskId) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  const userId = req.user.id;

  try {
    const isAssigned = await isUserAssignedToTask(userId, taskId);
    if (!isAssigned) {
      return res.status(403).json({
        message: "User not allowed to upload proof for this task",
      });
    }

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "task_proofs",
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res.status(500).json({
            message: "Error uploading image",
          });
        }

        const newProof = {
          img: result.secure_url,
          user_email: req.user.email,
          uploaded_at: new Date().toISOString(),
        };

        task.proof = [...task.proof, newProof];
        await task.save();

        return res.status(200).json({
          message: "Proof uploaded successfully",
          proof: newProof,
          taskId: task.id,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error("uploadProof error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
