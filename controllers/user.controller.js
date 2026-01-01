import User from "../models/user.model.js";
import Group from "../models/group.model.js";
import Task from "../models/task.model.js";
import Penalty from "../models/penalty.model.js";
import UserGroupTask from "../models/userGroupTask.model.js";
import cloudinary from "../lib/cloudinary.js";
import sequelize from '../lib/db.js';

export const getUserInGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findByPk(groupId, {
      include: [{
        model: User,
        through: {
          attributes: ['isAdmin', 'penalty_status']
        },
        attributes: ['id', 'email', 'name', 'lastname', 'avatar']
      }]
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    return res.status(200).json({
      groupId,
      users: group.Users
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

export const getUserStatsInGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const users = await User.findAll({
      include: [
        {
          model: Group,
          where: { id: groupId },
          attributes: [],
          through: { attributes: [] }
        },
        {
          model: Task,
          attributes: ['id', 'status'],
          required: false
        }
      ],
      attributes: ['id', 'name', 'email']
    });

    const penalties = await Penalty.findAll({
      where: { GroupId: groupId },
      attributes: [
        'UserId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'penaltyCount']
      ],
      group: ['UserId']
    });

    const penaltyMap = {};
    penalties.forEach(p => {
      penaltyMap[p.UserId] = Number(p.get('penaltyCount'));
    });

    const result = users.map(user => {
      const totalTasks = user.Tasks.length;
      const completedTasks = user.Tasks.filter(t => t.status).length;

      return {
        userId: user.id,
        name: user.name,
        email: user.email,
        totalTasks,
        completedTasks,
        penaltyCount: penaltyMap[user.id] || 0
      };
    });

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

export const getUserStats = async (req, res) => {
  const user = req.user;

  try {
    // 1. Lấy tasks của user
    const tasks = await Task.findAll({
      include: [
        {
          model: User,
          where: { id: user.id },
          attributes: []
        }
      ],
      attributes: ['id', 'status']
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status).length;

    // 2. Đếm penalty của user
    const penaltyCount = await Penalty.count({
      where: {
        UserId: user.id
      }
    });

    return res.status(200).json({
      userId: user.id,
      totalTasks,
      completedTasks,
      penaltyCount
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

export const editAvatarImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const userId = req.user.id;
  try {
    const userToUpdate = await User.findByPk(userId);

    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    const uploadStream = cloudinary.uploader.upload_stream({
        resource_type: 'image',
        folder: 'avatars' 
    }, async (error, result) => {
        if (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).json({ message: "Error uploading image to cloud service." });
        }

        userToUpdate.avatar = result.secure_url;
        await userToUpdate.save();  

        const { password: _, ...userWithoutPassword } = userToUpdate.toJSON();

        return res.status(200).json({
            message: "Avatar updated successfully",
            user: userWithoutPassword
        });
    });
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error("Server error in editAvatarImage:", error);
    return res.status(500).json({ message: "An internal server error occurred" });
  }
}