import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dbFindCourseByString = async (name: string, skip: number) => {
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
        skip: skip,
        take: 10,
    });
};

export const dbFindCourseByStringExcTaken = async (
    name: string,
    zid: string,
) => {
    const takenCourses = await prisma.courseTaken.findMany({
        where: {
            zid,
        },
        select: {
            courseId: true,
        },
    });

    const takenCourseIds = takenCourses.map((course) => course.courseId);

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
        select: {
            courseName: true,
            summary: true,
            id: true,
            skills: {
                select: {
                    skillName: true,
                },
                orderBy: {
                    id: "asc",
                },
            },
            CourseSkill: {
                select: {
                    rating: true,
                },
                orderBy: {
                    skillId: "asc",
                },
            },
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

        // Add the skills to the user's profile
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            select: {
                skills: {
                    select: {
                        skillName: true,
                    },
                },
            },
        });

        const skills = course?.skills.map((skill) => skill.skillName);

        // Find the skills in the database
        const SkillFound = await prisma.skills.findMany({
            where: {
                skillName: {
                    in: skills,
                },
            },
        });

        // Add the skills to the user's profile
        await prisma.profile.update({
            where: {
                zid,
            },
            data: {
                Skills: {
                    connect: SkillFound,
                },
            },
        });

        // Add the skills to all of the user's joined groups
        const groups = await prisma.group.findMany({
            where: {
                GroupMembers: {
                    some: {
                        zid,
                    },
                },
            },
            select: {
                id: true,
            },
        });

        groups.forEach(async (group) => {
            await prisma.group.update({
                where: {
                    id: group.id,
                },
                data: {
                    CombinedSkills: {
                        connect: SkillFound,
                    },
                },
            });
        });

        console.log(`Course ${courseId} added for user ${zid}`);
        return;
    } catch (error) {
        console.error("Error in dbAddCourse:", error);
        throw error;
    }
};

export const dbDeleteCourse = async (courseId: string, zid: string) => {
    // Step 1: Delete the course taken entry
    await prisma.courseTaken.delete({
        where: {
            zid_courseId: {
                zid: zid,
                courseId: courseId,
            },
        },
    });

    // Step 2: Get the skills associated with the course being deleted
    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
        },
        select: {
            skills: {
                select: {
                    skillName: true,
                },
            },
        },
    });

    const courseSkills = course?.skills.map((skill) => skill.skillName) || [];

    const otherCourses = await prisma.courseTaken.findMany({
        where: {
            zid: zid,
            courseId: {
                not: courseId,
            },
        },
        select: {
            course: {
                select: {
                    skills: {
                        select: {
                            skillName: true,
                        },
                    },
                },
            },
        },
    });

    // Step 4: Collect skills from other courses
    const otherCourseSkills = new Set<string>();
    otherCourses.forEach((courseTaken) => {
        courseTaken.course.skills.forEach((skill) => {
            otherCourseSkills.add(skill.skillName);
        });
    });

    // Step 5: Determine which skills to remove (those not found in other courses)
    const skillsToRemove = courseSkills.filter(
        (skill) => !otherCourseSkills.has(skill),
    );

    // Step 6: Find the skills in the database
    const skillsFound = await prisma.skills.findMany({
        where: {
            skillName: {
                in: skillsToRemove,
            },
        },
    });

    // Step 7: Remove the unique skills from the user's profile
    if (skillsFound.length > 0) {
        await prisma.profile.update({
            where: {
                zid,
            },
            data: {
                Skills: {
                    disconnect: skillsFound.map((skill) => ({ id: skill.id })),
                },
            },
        });
    }

    // Step 8: Get all groups the user is part of
    const groups = await prisma.group.findMany({
        where: {
            GroupMembers: {
                some: {
                    zid,
                },
            },
        },
        select: {
            id: true,
        },
    });

    for (const group of groups) {
        // Step 9: Remove the unique skills from the group
        const groupMembers = await prisma.group.findUnique({
            where: {
                id: group.id,
            },
            select: {
                GroupMembers: {
                    select: {
                        zid: true,
                        profileOwner: {
                            select: {
                                Skills: {
                                    select: {
                                        skillName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const groupMemberSkills = new Set<string>();
        groupMembers?.GroupMembers.forEach((member) => {
            if (member.zid !== zid) {
                member.profileOwner.Skills.forEach((skill) => {
                    groupMemberSkills.add(skill.skillName);
                });
            }
        });

        const uniqueSkills = skillsToRemove.filter(
            (skill) => !groupMemberSkills.has(skill),
        );

        if (uniqueSkills.length > 0) {
            const skillsToDisconnect = await prisma.skills.findMany({
                where: {
                    skillName: {
                        in: uniqueSkills,
                    },
                },
            });

            await prisma.group.update({
                where: {
                    id: group.id,
                },
                data: {
                    CombinedSkills: {
                        disconnect: skillsToDisconnect.map((skill) => ({
                            id: skill.id,
                        })),
                    },
                },
            });
        }
    }

    console.log(
        `Course ${courseId} removed for user ${zid} and skills ${skillsToRemove} disconnected from the profile and groups`,
    );

    return;
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
    console.log(skills);
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

    //TODO: Update all groups that have this course
};

export const dbGetCourse = async (courseId: string) => {
    return await prisma.course.findFirst({
        where: {
            id: courseId,
        },
        include: {
            skills: true,
        },
    });
};
