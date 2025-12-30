import Group from "../models/group.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import {isGroupAdmin, isUserAssignedToTask} from "../lib/authorization.js";

export const getAllTaskInGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const tasks = await Task.findAll({
      where: { GroupId: groupId },
      attributes: ['id', 'title', 'description', 'status', 'proof'],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'avatar'],
          through: {
            attributes: ['penalty_status']
          }
        }
      ]
    });

    return res.status(200).json({
      groupId,
      tasks
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

export const getMyTasks = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const tasks = await Task.findAll({
      attributes: ['id', 'title', 'description', 'status', 'proof'],
      include: [
        {
          model: User,
          where: { id: user.id },
          attributes: [],
          through: {
            attributes: ['penalty_status']
          }
        },
        {
          model: Group,
          attributes: ['id', 'title']
        }
      ]
    });

    const formattedTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      proof: task.proof,
      group: task.Group,
      penalty_status: task.Users[0].UserGroupTask.penalty_status
    }));

    return res.status(200).json({
      userId: user.id,
      total: formattedTasks.length,
      tasks: formattedTasks
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

export const createTask = async (req, res) => {
  const user = req.user;
  const { groupId } = req.params;
  const { title, description } = req.body;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!title) {
    return res.status(400).json({ message: "Missing title" });
  }

  const isAdmin = await isGroupAdmin(user.id, groupId);
  if (!isAdmin) {
    return res.status(403).json({ message: "Forbidden: Admin only" });
  }

  try {
    const task = await Task.create({
      title,
      description,
      GroupId: groupId
    });

    return res.status(201).json({
      message: "Task created",
      task
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
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
        message: "No valid fields provided for update"
      });
    }

    await task.update(updatePayload);

    return res.status(200).json({
      message: "Task updated",
      task
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
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
      message: "Task deleted"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export const uploadProof = async (req, res) => {
  const { taskId } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  if (!taskId) {
    return res.status(400).json({ message: 'Missing parameters' });
  }

  const userId = req.user.id;

  try {
    const isAssigned = await isUserAssignedToTask(userId, taskId);
    if (!isAssigned) {
      return res.status(403).json({
        message: 'User not allowed to upload proof for this task'
      });
    }

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'task_proofs'
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary error:', error);
          return res.status(500).json({
            message: 'Error uploading image'
          });
        }

        const newProof = {
          img: result.secure_url,
          user_email: req.user.email,
          uploaded_at: new Date().toISOString()
        };

        task.proofs = [...task.proofs, newProof];
        await task.save();

        return res.status(200).json({
          message: 'Proof uploaded successfully',
          proof: newProof,
          taskId: task.id
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('uploadProof error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};
