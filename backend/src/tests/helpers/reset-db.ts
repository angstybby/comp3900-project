import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async () => {
    await prisma.$transaction([
        prisma.notification.deleteMany(),
        prisma.projectInterest.deleteMany(),
        prisma.project.deleteMany(),
        prisma.groupInterest.deleteMany(),
        prisma.groupJoined.deleteMany(),
        prisma.group.deleteMany(),
        prisma.courseTaken.deleteMany(),
        prisma.courseSkill.deleteMany(),
        prisma.profile.deleteMany({
            where: {
                zid: {
                    not: "z0000000",
                },
            },
        }),
        prisma.user.deleteMany({
            where: {
                email: {
                    not: "admin@gmail.com",
                },
            },
        }),
    ]);
};
