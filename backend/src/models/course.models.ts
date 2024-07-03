import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dbFindCourseByString = async (name: string) => {
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

export const dbAddCourse = async (courseId: string, zid: string) => {
    prisma.courseTaken.create({
        data: {
            course: {
                connect: {
                    id: courseId,
                },
            },
            profileOwner: {
                connect: {
                    zid,
                },
            },
        },
    });
};

export const dbDeleteCourse = async (courseId: string, zid: string) => {
    prisma.courseTaken.delete({
        where: {
            zid_courseId: {
                courseId,
                zid,
            },
        },
    });
};
