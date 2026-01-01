import Group from "../models/group.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import { Op } from "sequelize";
import {
  isGroupAdmin,
  isUserAssignedToTask,
  isGroupMember,
} from "../lib/authorization.js";
import Penalty from "../models/penalty.model.js";
import { createNotification } from "./notification.controller.js";

export const createPenalty = async (req, res) => {
  try {
    const requester = req.user;
    const { taskId, groupId, foulUserId } = req.params;

    if (!requester) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!taskId || !groupId || !foulUserId) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    const isAdmin = await isGroupAdmin(requester.id, groupId);
    if (!isAdmin) {
      return res.status(403).json({
        message: "Forbidden: Admin only",
      });
    }

    const task = await Task.findOne({
      where: {
        id: taskId,
        GroupId: groupId,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAssigned = await isUserAssignedToTask(foulUserId, taskId);
    if (!isAssigned) {
      return res.status(403).json({
        message: "User is not assigned to this task",
      });
    }

    const existedPenalty = await Penalty.findOne({
      where: { TaskId: taskId },
    });

    if (existedPenalty) {
      return res.status(409).json({
        message: "Penalty already exists for this task",
      });
    }

    const penalty = await Penalty.create({
      title: `Penalty for task: ${task.title}`,
      description: `${task.penalty_description}`,
      UserId: foulUserId,
      TaskId: taskId,
      GroupId: groupId,
    });

    // Gửi thông báo cho user bị phạt
    await createNotification(
      foulUserId,
      "PENALTY_RECEIVED",
      "Bạn đã nhận phạt",
      `Bạn đã bị phạt do: ${task.penalty_description}`,
      penalty.id,
      "PENALTY"
    );

    return res.status(201).json({
      message: "Created penalty successfully",
      penalty,
    });
  } catch (error) {
    console.error("createPenalty error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deletePenalty = async (req, res) => {
  try {
    const requester = req.user;
    const { taskId, groupId, foulUserId } = req.params;

    if (!requester) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!taskId || !groupId || !foulUserId) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    // 1. Check admin
    const isAdmin = await isGroupAdmin(requester.id, groupId);
    if (!isAdmin) {
      return res.status(403).json({
        message: "Forbidden: Admin only",
      });
    }

    // 2. Check task tồn tại trong group
    const task = await Task.findOne({
      where: {
        id: taskId,
        GroupId: groupId,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 3. Check user có được assign task không
    const isAssigned = await isUserAssignedToTask(foulUserId, taskId);
    if (!isAssigned) {
      return res.status(403).json({
        message: "User is not assigned to this task",
      });
    }

    // 4. Tìm penalty
    const penalty = await Penalty.findOne({
      where: {
        TaskId: taskId,
        UserId: foulUserId,
        GroupId: groupId,
      },
    });

    if (!penalty) {
      return res.status(404).json({
        message: "Penalty not found",
      });
    }

    // 5. Xóa penalty
    await penalty.destroy();

    return res.status(200).json({
      message: "Deleted penalty successfully",
      penaltyId: penalty.id,
    });
  } catch (error) {
    console.error("deletePenalty error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getPenaltyByUserIdAndGroupId = async (req, res) => {
  try {
    const requester = req.user;
    const { userId, groupId } = req.params;

    if (!requester) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!userId || !groupId) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    const isMember = await isGroupMember(requester.id, groupId);
    if (!isMember) {
      return res.status(403).json({
        message: "Forbidden: Group members only",
      });
    }

    const penalties = await Penalty.findAll({
      where: {
        UserId: userId,
        GroupId: groupId,
      },
      include: [
        {
          model: Task,
          attributes: ["id", "title"],
        },
        {
          model: Group,
          attributes: ["id", "title"],
        },
      ],
      order: [["date", "DESC"]],
    });

    return res.status(200).json({
      userId,
      groupId,
      total: penalties.length,
      penalties,
    });
  } catch (error) {
    console.error("getPenaltyByUserIdAndGroupId error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getMyPenalty = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const penalties = await Penalty.findAll({
      where: { UserId: user.id },
      include: [
        {
          model: Task,
          attributes: ["id", "title"],
        },
        {
          model: Group,
          attributes: ["id", "title"],
        },
      ],
      order: [["date", "DESC"]],
    });

    return res.status(200).json({
      userId: user.id,
      total: penalties.length,
      penalties,
    });
  } catch (error) {
    console.error("getMyPenalty error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const searchPenaltyByTitle = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { q } = req.query;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isAdmin = await isGroupAdmin(user.id, groupId);
    if (!isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!q) {
      return res.status(400).json({ message: "Missing search query" });
    }

    const penalties = await Penalty.findAll({
      where: {
        title: {
          [Op.like]: `%${q}%`,
        },
        GroupId: groupId,
      },
      order: [["date", "DESC"]],
    });

    return res.status(200).json({
      query: q,
      total: penalties.length,
      penalties,
    });
  } catch (error) {
    console.error("searchPenaltyByTitle error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
