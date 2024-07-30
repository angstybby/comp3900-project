import { PrismaClient, UserType } from "@prisma/client";

const prisma = new PrismaClient();

// get all rankings
export const dbGetAllRankings = async () => {
    return await prisma.profile.findMany({
        where: {
            profileOwner: {
                userType: UserType.student,
            },
        },
        select: {
            zid: true,
            fullname: true,
            _count: {
                select: {
                    Skills: true,
                },
            },
        },
        orderBy: {
            Skills: {
                _count: "desc",
            },
        },
    });
};

// get ranking by zid
export const dbGetRankingByZid = async (zid: string) => {
    return await prisma.profile.findUniqueOrThrow({
        where: {
            zid,
        },
        select: {
            zid: true,
            fullname: true,
            _count: {
                select: {
                    Skills: true,
                },
            },
        },
    });
};
