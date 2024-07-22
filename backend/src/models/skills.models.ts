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

export const dbGetSkillsPopularity = async () => {
    const skills = await prisma.skills.findMany({
        include: {
            Course: true,
            Group: true,
            Project: true,
        },
    });

    const skillsPopularity = skills.map(skill => {
        const coursesCount = skill.Course.length;
        const groupsCount = skill.Group.length;
        const projectsCount = skill.Project.length;
        const totalCount = coursesCount + groupsCount + projectsCount;

        return {
            skillName: skill.skillName,
            popularity: totalCount,
        };
    });
    return skillsPopularity;
}

