import { PrismaClient, UserType } from "@prisma/client";

const prisma = new PrismaClient();

export const dbGetRankingBySkip = async (skip: number, search: string) => {
    return await prisma.profile.findMany({
        where: {
            profileOwner: {
                userType: UserType.student,
            },
            OR: [
                {
                    zid: {
                        contains: search,
                    },
                },
                {
                    fullname: {
                        contains: search,
                    },
                },
            ],
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
        skip: skip,
        take: 10,
    });
};

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
