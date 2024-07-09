import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dbAddProject = async (
    uid: string,
    title: string,
    description: string,
    skills: string[],
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

        await prisma.projectSkill.createMany({
            data: skills.map((skill) => {
                return {
                    projectId: project.id,
                    skill,
                };
            }),
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const dbDeleteProject = async (projectId: number) => {
    // clear all project skills
    await prisma.projectSkill.deleteMany({
        where: {
            projectId,
        },
    });

    // delete project
    await prisma.project.delete({
        where: {
            id: projectId,
        },
    });
};

export const dbAddProjectSkills = async (
    projectId: number,
    skills: string[],
) => {
    return await prisma.projectSkill.createMany({
        data: skills.map((skill) => {
            return {
                projectId,
                skill,
            };
        }),
    });
};

export const dbDeleteProjectSkill = async (
    projectId: number,
    skill: string,
) => {
    return await prisma.projectSkill.delete({
        where: {
            projectId_skill: {
                projectId,
                skill,
            },
        },
    });
};

export const dbAddProjectToGroup = async (uid: string) => {
    return await prisma.projectUser.create({
        
    })
}
