import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindCourseByString = async (name: string) => {
    return await prisma.course.findMany({
        where: {
            OR: [
                {
                    id: {
                        contains: name,
                    },
                },
                {
                    courseName: {
                        contains: name,
                    },
                },
            ],
        },
        select: {
            id: true,
            courseName: true,
        },
        take: 10,
    });
};
