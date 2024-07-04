import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dbCreateGroup = async (
    groupName: string,
    description: string,
    groupOwnerId: string,
    zIds?: string[],
) => {
    try {
        const newGroup = await prisma.group.create({
            data: {
                groupName,
                description,
                groupOwnerId,
                GroupMembers: {
                    create: zIds?.map((zid) => ({
                        profileOwner: {
                            connect: {
                                zid,
                            },
                        },
                    })),
                },
            },
        });
        return newGroup;
    } catch (error) {
        console.error("Error creating group:", error);
        throw error;
    }
};

export const dbInviteUserToGroup = async (
    groupId: number,
    ownerZid: string,
    zId: string,
) => {
    try {
        // Find the group by groupId
        const group = await prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });

        if (!group || group.groupOwnerId !== ownerZid) {
            throw new Error(
                "Only the group owner can invite users to the group.",
            );
        }

        // Find the user by zid
        const existingMember = await prisma.groupJoined.findUnique({
            where: {
                zid_groupId: { zid: zId, groupId },
            },
        });

        if (existingMember) {
            throw new Error("User is already a member of the group.");
        }

        // Invite the user to the group
        const invitedUser = await prisma.groupJoined.create({
            data: {
                groupId,
                zid: zId,
            },
        });

        return invitedUser;
    } catch (error) {
        console.error("Error inviting user to group:", error);
        throw error;
    }
};

export const dbUserExpressInterest = async (groupId: number, zId: string) => {
    try {
        const group = await prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });

        if (!group) {
            throw new Error("Group does not exist");
        }

        const existingMember = await prisma.groupJoined.findUnique({
            where: {
                zid_groupId: { zid: zId, groupId },
            },
        });

        if (existingMember) {
            throw new Error("User is already a member of the group.");
        }

        const newInterest = await prisma.groupInterest.create({
            data: {
                groupId,
                zid: zId,
            },
        });

        return newInterest;
    } catch (error) {
        console.error("Error expressing interest in group:", error);
        throw error;
    }
};

export const dbLeaveGroup = async (groupId: number, zId: string) => {
    try {
        const group = await prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });

        if (!group) {
            throw new Error("Group does not exist");
        }

        const groupMember = await prisma.groupJoined.findUnique({
            where: {
                zid_groupId: { zid: zId, groupId },
            },
        });

        if (!groupMember) {
            throw new Error("User is not a member of the group.");
        }

        await prisma.groupJoined.delete({
            where: {
                zid_groupId: { zid: zId, groupId },
            },
        });

        return;
    } catch (error) {
        console.error("Error leaving group:", error);
        throw error;
    }
};

export const dbUpdateGroup = async (
    groupId: number,
    groupName: string,
    groupOwnerId: string,
    description: string,
) => {
    try {
        const group = await prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });

        if (!group || group.groupOwnerId !== groupOwnerId) {
            throw new Error("Only the group owner can update the group.");
        }

        const updatedGroup = await prisma.group.update({
            where: {
                id: groupId,
            },
            data: {
                groupName,
                description,
            },
        });
        return updatedGroup;
    } catch (error) {
        console.error("Error updating group:", error);
        throw error;
    }
};

export const dbKickUserFromGroup = async (
    groupId: number,
    groupOwnerId: string,
    zId: string,
) => {
    try {
        const group = await prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });

        if (!group || group.groupOwnerId !== groupOwnerId) {
            throw new Error(
                "Only the group owner can kick users from the group.",
            );
        }

        const groupMember = await prisma.groupJoined.findUnique({
            where: {
                zid_groupId: { zid: zId, groupId },
            },
        });

        if (!groupMember) {
            throw new Error("User is not a member of the group.");
        }

        await prisma.groupJoined.delete({
            where: {
                zid_groupId: { zid: zId, groupId },
            },
        });

        return;
    } catch (error) {
        console.error("Error kicking user from group:", error);
        throw error;
    }
};

export const dbGroupExpressInterstProject = async (
    groupId: number,
    zId: string,
    projectId: number,
) => {
    try {
        const group = await prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });

        if (!group) {
            throw new Error("Group does not exist");
        }

        const groupMember = await prisma.groupJoined.findUnique({
            where: {
                zid_groupId: { zid: zId, groupId },
            },
        });

        if (!groupMember) {
            throw new Error("User is not a member of the group.");
        }

        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
            },
        });

        if (!project) {
            throw new Error("Project does not exist");
        }

        const existingProjectInterest = await prisma.projectTaken.findUnique({
            where: {
                projectId_groupId: { projectId, groupId },
            },
        });

        if (existingProjectInterest) {
            throw new Error(
                "User has already expressed interest in the project.",
            );
        }

        const newInterest = await prisma.projectTaken.create({
            data: {
                projectId,
                groupId,
            },
        });

        return newInterest;
    } catch (error) {
        console.error("Error expressing interest in project:", error);
        throw error;
    }
};

export const dbAcceptUserToGroup = async (
    groupId: number,
    groupOwnerId: string,
    zId: string,
) => {
    try {
        const group = await prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });

        if (!group || group.groupOwnerId !== groupOwnerId) {
            throw new Error(
                "Only the group owner can accept users to the group.",
            );
        }

        const groupInterest = await prisma.groupInterest.findUnique({
            where: {
                groupId_zid: { groupId, zid: zId },
            },
        });

        if (!groupInterest) {
            throw new Error("User has not expressed interest in the group.");
        }

        await prisma.groupInterest.delete({
            where: {
                groupId_zid: { groupId, zid: zId },
            },
        });

        await prisma.groupJoined.create({
            data: {
                groupId,
                zid: zId,
            },
        });

        return;
    } catch (error) {
        console.error("Error accepting user to group:", error);
        throw error;
    }
};

export const dbDeclineUserToGroup = async (
    groupId: number,
    groupOwnerId: string,
    zId: string,
) => {
    try {
        const group = await prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });

        if (!group || group.groupOwnerId !== groupOwnerId) {
            throw new Error(
                "Only the group owner can decline users to the group.",
            );
        }

        const groupInterest = await prisma.groupInterest.findUnique({
            where: {
                groupId_zid: { groupId, zid: zId },
            },
        });

        if (!groupInterest) {
            throw new Error("User has not expressed interest in the group.");
        }

        await prisma.groupInterest.delete({
            where: {
                groupId_zid: { groupId, zid: zId },
            },
        });

        return;
    } catch (error) {
        console.error("Error declining user to group:", error);
        throw error;
    }
};

export const dbFindGroupByString = async (name: string) => {
    return await prisma.group.findMany({
        where: {
            groupName: {
                contains: name,
            },
        },
        select: {
            id: true,
            groupName: true,
            description: true,
            groupOwnerId: true,
        },
    });
};

export const dbGetGroupApplications = async (
    groupId: number,
    groupOwnerId: string,
) => {
    try {
        const group = await prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });

        if (!group || group.groupOwnerId !== groupOwnerId) {
            throw new Error(
                "Only the group owner can view group applications.",
            );
        }

        const groupInterests = await prisma.groupInterest.findMany({
            where: {
                groupId,
            },
            select: {
                zid: true,
            },
        });

        return groupInterests;
    } catch (error) {
        console.error("Error getting group applications:", error);
        throw error;
    }
};
