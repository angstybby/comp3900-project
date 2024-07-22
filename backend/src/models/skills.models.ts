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
