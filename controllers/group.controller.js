import Group from "../models/group.model.js";
import UserGroupTask from "../models/userGroupTask.model.js";
import jwt from "jsonwebtoken";
import sequelize from '../lib/db.js';
import { generateInviteToken } from "../lib/util.js";

export const createGroup = async (req,res) => {
    const {title, description} = req.body;
    const user = req.user;
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!title || !description) {
        return res.status(400).json({ message: 'Missing title, description, or user' });
    }
    const transaction = await sequelize.transaction();
    try {
        const group = await Group.create({
            title,
            description
        },{ transaction });
        await group.addUser(user, {
            through: { isAdmin: true },
            transaction
        });
        await transaction.commit();
        return res.status(201).json({
            group,
            isAdmin: true
        })
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({
            message: "Internal Server Error" ,
            error: error
        })
    }
}

export const getJoinedGroup = async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const groups = await user.getGroups({
            through: {
                attributes: ['isAdmin']
            }
        });
        return res.status(200).json({ groups });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

export const leaveGroup = async (req, res) => {
    const user = req.user;
    const { groupId } = req.params;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const transaction = await sequelize.transaction();

    try {
        const group = await Group.findByPk(groupId);
        if (!group) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Group not found' });
        }

        await group.removeUser(user, { transaction });

        await transaction.commit();
        return res.status(200).json({
            message: 'Leave group successfully'
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

export const deleteGroup = async (req, res) => {
    const user = req.user;
    const { groupId } = req.params;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const transaction = await sequelize.transaction();

    try {
        const group = await Group.findByPk(groupId);
        if (!group) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Group not found' });
        }

        const relation = await UserGroupTask.findOne({
            where: {
                UserId: user.id,
                GroupId: groupId,
                isAdmin: true
            }
        });

        if (!relation) {
            await transaction.rollback();
            return res.status(403).json({ message: 'Forbidden' });
        }

        await group.destroy({ transaction });

        await transaction.commit();
        return res.status(200).json({
            message: 'Group deleted successfully'
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

export const createInviteToken = async (req, res) => {
    const user = req.user;
    const { groupId } = req.params;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const relation = await UserGroupTask.findOne({
            where: {
                UserId: user.id,
                GroupId: groupId,
                isAdmin: true
            }
        });

        if (!relation) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const inviteToken = generateInviteToken(groupId);

        return res.status(201).json({
            inviteToken,
            message: "Invite Code Created Successfully Expires in 7d"
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

export const joinGroup = async (req, res) => {
    const user = req.user;
    const { groupId, inviteToken } = req.body;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const transaction = await sequelize.transaction();

    try {
        const decoded = jwt.verify(inviteToken, process.env.JWT_ACCESS_SECRET)
        if(decoded.groupId !== groupId){
            return res.status(403).json({
                message: "Forbidden"
            })
        }

        const group = await Group.findByPk(groupId);
        if (!group) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Group not found' });
        }
        
        await group.addUser(user, {
            through: { isAdmin: false },
            transaction
        });

        await transaction.commit();
        return res.status(200).json({
            message: 'Join group successfully'
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};
