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

