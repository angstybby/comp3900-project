import { InterestStatus, PrismaClient } from "@prisma/client";
import { CombinedProject } from "../utils/project.utils";

const prisma = new PrismaClient();

// add project to database
export const dbAddProject = async (
    uid: string,
    title: string,
    description: string,
    skills: number[],
) => {
    try {
        const project = await prisma.project.create({
            data: {
                title: title,
                description: description,
                ProjectOwner: {
                    connect: {
                        zid: uid,
                    },
                },
            },
        });

        if (skills.length > 0) {
            await dbAddProjectSkills(project.id, skills);
        }

        return project.id;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// delete project from database
export const dbDeleteProject = async (projectId: number) => {
    // delete project and skills connections aswell
    await prisma.project.delete({
        where: {
            id: projectId,
        },
    });
};

// Connects gracefully and will not fail if skill is already connected
// add skills to project
export const dbAddProjectSkills = async (
    projectId: number,
    skills: number[],
) => {
    await prisma.project.update({
        where: {
            id: projectId,
        },
        data: {
            skills: {
                connect: skills.map((skill) => {
                    return {
                        id: skill,
                    };
                }),
            },
        },
    });
};

// delete skills from project
export const dbDeleteProjectSkills = async (
    projectId: number,
    skills: number[],
) => {
    await prisma.project.update({
        where: {
            id: projectId,
        },
        data: {
            skills: {
                disconnect: skills.map((skill) => {
                    return {
                        id: skill,
                    };
                }),
            },
        },
    });
};

// get all project applications
export const dbGetAllProjectApplications = async (projectId: number) => {
    return await prisma.projectInterest.findMany({
        where: {
            projectId,
        },
        include: {
            group: {
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
                },
            },
            project: {
                select: {
                    title: true,
                },
            },
        },
    });
};

// get project owner by projectid
export const dbGetProjectOwnerById = async (projectId: number) => {
    return await prisma.project.findUnique({
        where: {
            id: projectId,
        },
        select: {
            ProjectOwner: true,
        },
    });
};

// get project details by projectid
export const dbGetProject = async (projectId: number) => {
    // Fetch the project details along with the related entities
    const response = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
        include: {
            ProjectOwner: true,
            skills: {
                select: {
                    id: true,
                    skillName: true,
                },
            },
            Group: {
                include: {
                    GroupMembers: true,
                },
            },
        },
    });

    if (!response) {
        throw new Error("Project not found");
    }

    const groupsWithMemberCount = response.Group.map((group) => {
        const membersCount = group.GroupMembers.length;
        return {
            ...group,
            members: membersCount,
        };
    });

    const cleanedGroups = groupsWithMemberCount.map(
        ({ GroupMembers, ...rest }) => ({
            ...rest,
        }),
    );

    return {
        ...response,
        Group: cleanedGroups,
    };
};

// Get all projects with a limit of 25 and a skip value
export const dbGetProjects = async (skip: number) => {
    return await prisma.project.findMany({
        skip,
        take: 25,
        include: {
            ProjectOwner: true,
            skills: {
                select: {
                    id: true,
                    skillName: true,
                },
            },
        },
    });
};

// Get all projects a user is a part of based on groups and have a limit of 25 and a skip value
export const dbGetUserJoinedProjects = async (
    zid: string,
    skip: number = 0,
) => {
    return await prisma.groupJoined.findMany({
        where: {
            zid: zid,
        },
        select: {
            group: {
                select: {
                    Project: {
                        skip: skip,
                        take: 25,
                    },
                    groupName: true,
                    id: true,
                },
            },
        },
    });
};

// get projects owned by a user
export const dbGetProjectsOwnedByUser = async (zid: string, skip: number) => {
    return await prisma.project.findMany({
        skip,
        take: 25,
        where: {
            projectOwnerId: zid,
        },
        include: {
            ProjectOwner: true,
            skills: {
                select: {
                    id: true,
                    skillName: true,
                },
            },
        },
    });
};

// accept group to project
export const dbAcceptGroupToProject = async (
    groupId: number,
    projectId: number,
) => {
    // update the group application status
    console.log("project id", projectId);
    console.log("group id", groupId);
    await prisma.projectInterest.update({
        where: {
            projectId_groupId: {
                projectId,
                groupId,
            },
        },
        data: {
            status: InterestStatus.ACCEPTED,
        },
    });

    // update the project to have the group
    await prisma.project.update({
        where: {
            id: projectId,
        },
        data: {
            Group: {
                connect: {
                    id: groupId,
                },
            },
        },
    });
};

// reject group application to a project
export const dbRejectGroupToProject = async (
    groupId: number,
    projectId: number,
) => {
    await prisma.projectInterest.update({
        where: {
            projectId_groupId: {
                projectId,
                groupId,
            },
        },
        data: {
            status: InterestStatus.DENIED,
        },
    });
};

// get projects by their name
export const dbGetProjectByName = async (name: string) => {
    return await prisma.project.findUnique({
        where: {
            title: name,
        },
        select: {
            id: true,
            title: true,
            description: true,
        },
    });
};

// get all projects with skills
export const dbGetAllProjectsWithSkills = async (groupId: number) => {
    const returnProjects: CombinedProject[] = [];
    const projects = await prisma.project.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            projectOwnerId: true,
        },
    });

    const groupProjects = await prisma.group.findFirst({
        where: {
            id: groupId,
        },
        select: {
            Project: {
                select: {
                    id: true,
                },
            },
        },
    });

    // Filter out projects that are already in the group
    const filteredProjects = projects.filter(
        (project) =>
            !groupProjects?.Project.some(
                (groupProject) => groupProject.id === project.id,
            ),
    );

    for (const project of filteredProjects) {
        const tempProject: CombinedProject = project;
        const skills = await prisma.skills.findMany({
            where: {
                Project: {
                    some: {
                        id: project.id,
                    },
                },
            },
        });
        const skillNames = skills.map((skill) => skill.skillName);
        tempProject["skills"] = skillNames;
        returnProjects.push(tempProject);
    }
    return returnProjects;
};

// update project details
export const dbUpdateProject = async (
    projectId: number,
    title: string,
    description: string,
    skills: number[],
) => {
    await prisma.project.update({
        where: {
            id: projectId,
        },
        data: {
            title: title,
            description: description,
        },
    });

    const currentSkills = await prisma.project.findUnique({
        where: { id: projectId },
        select: { skills: { select: { id: true } } },
    });

    const currentSkillIds =
        currentSkills?.skills.map((skill) => skill.id) || [];

    // Determine which skills to add and which to remove
    const skillsToAdd = skills.filter(
        (skillId) => !currentSkillIds.includes(skillId),
    );
    const skillsToRemove = currentSkillIds.filter(
        (skillId) => !skills.includes(skillId),
    );

    await dbAddProjectSkills(projectId, skillsToAdd);
    await dbDeleteProjectSkills(projectId, skillsToRemove);
};

export const dbUpdateProjectStatus = async (projectId: number, status: string) => {
    await prisma.project.update({
        where: {
            id: projectId,
        },
        data: {
            status: status,
        },
    });
};

export const dbGetUserInProject = async (projectId: number, zid: string) => {
    // Check the user's groups and return the groupName if they are in the project
    const groups = await prisma.groupJoined.findMany({
        where: {
            zid: zid,
        },
        select: {
            group: {
                select: {
                    id: true,
                    groupName: true,
                    description: true,
                    GroupMembers: {
                        select: {
                            zid: true,
                        },
                    },
                    MaxMembers: true,
                    groupOwnerId: true,
                    Project: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
        },
    });

    // Filter out groups that are in the project and add group member count
    const userGroups = groups
        .filter((group) => {
            return group.group.Project.some(
                (project) => project.id === projectId,
            );
        })
        .map((group) => {
            return {
                id: group.group.id,
                groupName: group.group.groupName,
                description: group.group.description,
                members: group.group.GroupMembers.length,
                MaxMembers: group.group.MaxMembers,
                groupOwnerId: group.group.groupOwnerId,
            };
        });

    return userGroups;
};
