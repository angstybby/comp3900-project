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
            id: id,
        },
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

    // Add skills to user
    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
        },
        select: {
            skills: true,
        },
    });

    if (course) {
        prisma.profile.update({
            where: {
                zid,
            },
            data: {
                Skills: {
                    set: course.skills,
                },
            },
        });
    }
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

export const dbGetAllCourses = async (skip: number) => {
    return await prisma.course.findMany({
        skip,
        take: 25,
        select: {
            id: true,
            courseName: true,
        },
    });
};

export const dbUpdateCourse = async (
    id: string,
    summary: string,
    skills: string[],
) => {
    await prisma.course.update({
        where: {
            id: id,
        },
        data: {
            summary: summary,
        },
    });

    // Check if the skills is in the database, if not skip
    const SkillFound = await prisma.skills.findMany({
        where: {
            skillName: {
                in: skills,
            },
        },
    });

    if (SkillFound.length > 0) {
        await prisma.course.update({
            where: {
                id: id,
            },
            data: {
                skills: {
                    set: SkillFound,
                },
            },
        });
    }
};
