import UserGroupTask from "../models/userGroupTask.model.js";
export const isGroupAdmin = async (userId, groupId) => {
  if(!groupId || !userId){
    return res.status(400).json({ message: "Missing Group Id or User Id" });
  }
  const record = await UserGroupTask.findOne({
    where: {
      UserId: userId,
      GroupId: groupId,
      isAdmin: true
    }
  });

  return !!record;
};

export const isUserAssignedToTask = async (userId, taskId) => {
  const record = await UserGroupTask.findOne({
    where: {
      UserId: userId,
      TaskId: taskId
    }
  });

  return !!record;
};

export const isGroupMember = async (userId, groupId) => {
  if(!groupId){
    return res.status(400).json({ message: "Missing Group Id" });
  }
  const record = await UserGroupTask.findOne({
    where: {
      UserId: userId,
      GroupId: groupId
    }
  });

  return !!record;
};