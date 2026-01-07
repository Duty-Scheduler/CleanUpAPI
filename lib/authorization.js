import UserGroupTask from "../models/userGroupTask.model.js";
export const isGroupAdmin = async (userId, groupId) => {
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
  console.log("isGroupMember?");
  console.log("userId: ", userId);
  console.log("groupId: ", groupId);
  const record = await UserGroupTask.findOne({
    where: {
      UserId: userId,
      GroupId: groupId
    }
  });

  return !!record;
};