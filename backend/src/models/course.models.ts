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
  try {
    await prisma.courseTaken.create({
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
    console.log(`Course ${courseId} added for user ${zid}`);
  } catch (error) {
    console.error("Error in dbAddCourse:", error);
    throw error;
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
