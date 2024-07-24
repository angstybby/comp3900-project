import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dbSearchSkillByName = async (skillName: string) => {
    return await prisma.skills.findMany({
        where: {
            skillName: {
                contains: skillName,
            },
        },
        select: {
            id: true,
            skillName: true,
        },
        take: 10,
    });
};

export const dbGenerateGapAnalysis = async (
    groupId: number,
    projectId: number,
) => {
    const group = await prisma.group.findUnique({
        where: {
            id: groupId,
        },
        include: {
            CombinedSkills: true,
        },
    });

    if (!group) {
        throw new Error("Group not found");
    }

    const groupSkills = group.CombinedSkills.map((skill) => skill);

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
        include: {
            skills: true,
        },
    });

    if (!project) {
        throw new Error("Project not found");
    }
    const projectSkills = project.skills.map((skill) => skill);

    const matchingSkills = projectSkills.filter((skill) =>
        groupSkills.includes(skill),
    );
    const unmatchedSkills = projectSkills.filter(
        (skill) => !groupSkills.includes(skill),
    );

    return { projectSkills, matchingSkills, unmatchedSkills };
};

export const dbGetSkills = async () => {
    return await prisma.skills.findMany({
        select: {
            id: true,
            skillName: true,
        },
    });
};

export const dbUpdateSkillsRatings = async (
    courseId: string,
    skillNames: string[],
    skillRatings: number[],
) => {
    if (skillNames.length !== skillRatings.length) {
        throw new Error("Skill names and ratings do not match");
    }

    // deletes all the course skills
    await prisma.courseSkill.deleteMany({
        where: {
            courseId,
        },
    });

    // remake it
    for (let i = 0; i < skillNames.length; i++) {
        await prisma.courseSkill.create({
            data: {
                course: {
                    connect: {
                        id: courseId,
                    },
                },
                skill: {
                    connect: {
                        skillName: skillNames[i],
                    },
                },
                rating: skillRatings[i],
            },
        });
    }
};
