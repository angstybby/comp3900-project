import { PrismaClient } from "@prisma/client";
import courseDataJson from "../src/data/courseCodesAndTitle.json";
import SkillsData from "../src/data/skills.json";

const prisma = new PrismaClient();
const seedCourses = async () => {
    const courseData = courseDataJson;
    // Only do this when the database in completely reset
    if (courseData.length > 0) {
        await prisma.course.createMany({
            data: courseData.map((course) => ({
                id: course.Code,
                courseName: course.Title,
            })),
        });
    }
};

const seedSkills = async () => {
    const skillsData = SkillsData.skills;
    // Only do this when the database in completely reset
    if (skillsData.length > 0) {
        await prisma.skills.createMany({
            data: skillsData.map((skill) => ({
                skillName: skill,
            })),
        });
    }
};

const seedAdmin = async () => {
    await prisma.user.create({
        data: {
            zid: "z0000000",
            email: "admin@gmail.com",
            userType: "admin",
            password:
                "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
            isAdmin: true,
        },
    });

    await prisma.profile.create({
        data: {
            fullname: "Admin",
            profileOwner: {
                connect: {
                    zid: "z0000000",
                },
            },
        },
    });
};

seedAdmin()
    .then(() => {
        console.log("Admin Done");
        prisma.$disconnect();
    })
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
    });

seedCourses()
    .then(() => {
        console.log("Courses Done");
        prisma.$disconnect();
    })
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
    });

seedSkills()
    .then(() => {
        console.log("Skills Done");
        prisma.$disconnect();
    })
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
    });
