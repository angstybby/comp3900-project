import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dbCreateGroup = async (
    groupName: string,
    description: string,
    groupOwnerId: string,
    zIds?: string[],
) => {
    try {
        const newGroup = await prisma.group.create({
            data: {
                groupName,
                description,
                groupOwnerId,
                GroupMembers: {
                    create: zIds?.map((zid) => ({
                        profileOwner: {
                            connect: {
                                zid,
                            },
                        },
                    })),
                },
            },
        });
        return newGroup;
    } catch (error) {
        console.error("Error creating group:", error);
        throw error;
    }
};
