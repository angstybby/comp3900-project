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


export const dbFindCourseByStringExcTaken = async (name: string, zid: string) => {
  const takenCourses = await prisma.courseTaken.findMany({
      where: {
          zid,
      },
      select: {
          courseId: true,
      },
  });

  const takenCourseIds = takenCourses.map(course => course.courseId);

  return await prisma.course.findMany({
      where: {
          AND: [
              {
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
              {
                  id: {
                      notIn: takenCourseIds,
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
        const skills = course.skills;

        prisma.profile.update({
            where: {
                zid,
            },
            data: {
                Skills: {
                    set: skills,
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
    return await prisma.course.update({
        where: {
            id: id,
        },
        data: {
            summary: summary,
            skills: skills,
        },
    });
};
