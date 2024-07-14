import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

        await dbAddProjectSkills(project.id, skills);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const dbDeleteProject = async (projectId: number) => {
    // delete project and skills connections aswell
    await prisma.project.delete({
        where: {
            id: projectId,
        },
    });
};

// Connects gracefully and will not fail if skill is already connected
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

export const dbDeleteProjectSkill = async (
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

// Let me (koda) know if you need more from this
export const dbGetAllProjectApplications = async (projectId: number) => {
    return await prisma.projectTaken.findMany({
        where: {
            projectId,
        },
        include: {
            group: true,
        },
    });
};

export const dbGetProject = async (projectId: number) => {
    return await prisma.project.findUnique({
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
            projectMembers: true

        },
    });
};
