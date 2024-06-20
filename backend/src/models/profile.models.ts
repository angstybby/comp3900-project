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

// export const dbGetProfile = async (): Promise<Profile> => {
//     return {};
// };

// export const dbUpdateProfile = async (profile: Profile): Promise<Profile> => {
//     return {};
// };
