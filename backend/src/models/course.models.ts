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

export const dbFindCourseById = async (id: string) => {
    return await prisma.course.findUnique({
        where: {
            id: id
        }
    })
}

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

export const dbGetUserCourses = async (zid: string) => {
    return await prisma.courseTaken.findMany({
        where: {
            zid,
        },
        select: {
            course: true,
        },
    });
};

export const dbGetAllCourses = async () => {
    return await prisma.course.findMany();
};
