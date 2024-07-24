import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dbCreateGroup = async (
    groupName: string,
    description: string,
    groupOwnerId: string,
    maxMembers: number,
) => {
    try {
        const newGroup = await prisma.group.create({
            data: {
                groupName,
                description,
                groupOwnerId,
                MaxMembers: maxMembers,
            },
        });

        // Add owner to group members
        await prisma.groupJoined.create({
            data: {
                groupId: newGroup.id,
                zid: groupOwnerId,
            },
        });

        // Add owner skills to the group
        const userSkills = await prisma.profile.findFirst({
            where: {
                zid: groupOwnerId,
            },
            select: {
                Skills: true,
            },
        });

        await prisma.group.update({
            where: {
                id: newGroup.id,
            },
            data: {
                CombinedSkills: {
                    connect: userSkills?.Skills,
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
        await prisma.groupJoined.create({
            data: {
                groupId,
                zid: zId,
            },
        });

        // Add the user skills to the group

        const userSkills = await prisma.profile.findFirst({
            where: {
                zid: zId,
            },
            select: {
                Skills: true,
            },
        });

        await prisma.group.update({
            where: {
                id: groupId,
            },
            data: {
                CombinedSkills: {
                    connect: userSkills?.Skills,
                },
            },
        });

        return;
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

        // Remove the unique skills of the user from the group
        const userSkills = await prisma.profile.findFirst({
            where: {
                zid: zId,
            },
            select: {
                Skills: true,
            },
        });

        // Check other users skills
        const otherUsers = await prisma.groupJoined.findMany({
            where: {
                groupId,
                zid: {
                    not: zId,
                },
            },
            select: {
                zid: true,
            },
        });

        const otherUsersSkills = await prisma.profile.findMany({
            where: {
                zid: {
                    in: otherUsers.map((user) => user.zid),
                },
            },
            select: {
                Skills: true,
            },
        });

        console.log(otherUsersSkills);

        const otherUsersCombinedSkills = otherUsersSkills.flatMap(
            (user) => user.Skills,
        );

        const uniqueSkills = userSkills?.Skills.filter(
            (skill) =>
                !otherUsersCombinedSkills.find(
                    (otherSkill) => otherSkill.id === skill.id,
                ),
        );

        await prisma.group.update({
            where: {
                id: groupId,
            },
            data: {
                CombinedSkills: {
                    disconnect: uniqueSkills,
                },
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
    maxMembers: number,
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
                MaxMembers: maxMembers,
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

        // Remove the unique skills of the user from the group
        const userSkills = await prisma.profile.findFirst({
            where: {
                zid: zId,
            },
            select: {
                Skills: true,
            },
        });

        // Check other users skills
        const otherUsers = await prisma.groupJoined.findMany({
            where: {
                groupId,
                zid: {
                    not: zId,
                },
            },
            select: {
                zid: true,
            },
        });

        const otherUsersSkills = await prisma.profile.findMany({
            where: {
                zid: {
                    in: otherUsers.map((user) => user.zid),
                },
            },
            select: {
                Skills: true,
            },
        });

        console.log(otherUsersSkills);

        const otherUsersCombinedSkills = otherUsersSkills.flatMap(
            (user) => user.Skills,
        );

        const uniqueSkills = userSkills?.Skills.filter(
            (skill) =>
                !otherUsersCombinedSkills.find(
                    (otherSkill) => otherSkill.id === skill.id,
                ),
        );

        await prisma.group.update({
            where: {
                id: groupId,
            },
            data: {
                CombinedSkills: {
                    disconnect: uniqueSkills,
                },
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

        const existingProjectInterest = await prisma.projectInterest.findUnique(
            {
                where: {
                    projectId_groupId: { projectId, groupId },
                },
            },
        );

        if (existingProjectInterest) {
            throw new Error(
                "User has already expressed interest in the project.",
            );
        }

        const newInterest = await prisma.projectInterest.create({
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

        const userSkills = await prisma.profile.findFirst({
            where: {
                zid: zId,
            },
            select: {
                Skills: true,
            },
        });

        await prisma.group.update({
            where: {
                id: groupId,
            },
            data: {
                CombinedSkills: {
                    connect: userSkills?.Skills,
                },
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

export const dbGetUserInGroup = async (zId: string) => {
    try {
        // Fetch the groups the user is a part of
        const groupsPartOf = await prisma.groupJoined.findMany({
            where: {
                zid: zId,
            },
            select: {
                groupId: true,
            },
        });

        // Extract group IDs
        const groupIds = groupsPartOf.map((group) => group.groupId);

        // Fetch the groups the user is a part of
        const groups = await prisma.group.findMany({
            where: {
                id: { in: groupIds },
            },
        });

        // Combine the two arrays
        const combinedGroups = [...groups];

        // Fetch the member count for each group
        const groupsWithMemberCount = await Promise.all(
            combinedGroups.map(async (group) => {
                let members = await prisma.groupJoined.count({
                    where: { groupId: group.id },
                });

                return {
                    ...group,
                    members,
                };
            }),
        );

        return groupsWithMemberCount;
    } catch (error) {
        console.error("Error getting user in group:", error);
        throw error;
    }
};

export const dbGetGroup = async (groupId: number) => {
    try {
        const group = await prisma.group.findFirst({
            where: {
                id: groupId,
            },
            select: {
                id: true,
                groupName: true,
                description: true,
                groupOwnerId: true,
                MaxMembers: true,
                CombinedSkills: {
                    select: {
                        skillName: true,
                    },
                },
                Project: true,
                ProjectInterest: true,
            },
        });

        if (!group) {
            throw new Error("Group does not exist");
        }

        // get the group owner details
        const groupOwnerName = await prisma.profile.findFirst({
            where: {
                zid: group.groupOwnerId,
            },
            select: {
                fullname: true,
            },
        });

        // Fetch the member count for the group
        let members = await prisma.groupJoined.count({
            where: { groupId },
        });

        return {
            ...group,
            members,
            groupOwnerName: groupOwnerName?.fullname,
        };
    } catch (error) {
        console.error("Error getting group:", error);
        throw error;
    }
};

export const dbGetUsersNotInGroup = async (groupId: number) => {
    try {
        const group = await prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });

        if (!group) {
            throw new Error("Group does not exist");
        }

        const groupMembers = await prisma.groupJoined.findMany({
            where: {
                groupId,
            },
            select: {
                zid: true,
            },
        });

        const groupMemberIds = groupMembers.map((member) => member.zid);

        const usersNotInGroup = await prisma.profile.findMany({
            where: {
                zid: {
                    notIn: groupMemberIds,
                },
                profileOwner: {
                    userType: "student",
                },
            },
                select: {
                    zid: true,
                    fullname: true,
                    profilePicture: true,
                    Skills: {
                        select: {
                            skillName: true,
                        },
                    },
            },
        });

        return usersNotInGroup;
    } catch (error) {
        console.error("Error getting users not in group:", error);
        throw error;
    }
};

export const dbIsUserJoinedGroup = async (groupId: number, zId: string) => {
    try {
        const groupMember = await prisma.groupJoined.findUnique({
            where: {
                zid_groupId: { zid: zId, groupId },
            },
        });

        return !!groupMember;
    } catch (error) {
        console.error("Error checking if user joined group:", error);
        throw error;
    }
};
