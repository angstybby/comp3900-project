import { PrismaClient, Profile } from "@prisma/client";

const prisma = new PrismaClient();

export const dbAddProfile = async (zid: string, fullname: string) => {
    try {
        await prisma.profile.create({
            data: {
                zid,
                fullname,
            },
        });
        console.log("Profile created");
    } catch (error) {
        console.log(error);
        throw new Error("An database error occurred");
    }
};

export const dbGetProfile = async (zid: string): Promise<Profile> => {
    try {
        const user = await prisma.profile.findFirst({
            where: {
                zid: zid,
            },
        });
        if (!user) {
            throw new Error("Profile not found");
        }
        return user;
    } catch (e) {
        console.log(e);
        throw new Error("An database error occurred");
    }
};

export const dbUpdateProfile = async (profile: Profile): Promise<Profile> => {
    try {
        const user = await prisma.profile.update({
            where: {
                zid: profile.zid,
            },
            data: {
                profilePicture: profile.profilePicture,
                fullname: profile.fullname,
                description: profile.description,
                resume: profile.resume,
            },
        });
        return user;
    } catch (e) {
        console.log(e);
        throw new Error("An database error occurred");
    }
};

export const getUserType = async (zid: string) => {
    return await prisma.user.findFirst({
        where: {
            zid: zid,
        },
        select: {
            userType: true,
        }
    })
}

export const dbGetStudentProfiles = async () => {
    return await prisma.profile.findMany({
        where: {
            profileOwner: {
                userType: "student",
            }
        },
        select: {
            zid: true,
            Skills: {
                select: {
                    skillName: true,
                },
            },
        },
    });
}