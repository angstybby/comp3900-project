import { $Enums, PrismaClient, User, UserType } from "@prisma/client";

const prisma = new PrismaClient();

export interface JwtUser {
    zid: string;
    email: string;
    fullname: string;
    userType: UserType;
}

export const dbAddUser = async (
    zid: string,
    email: string,
    password: string,
    userType: UserType,
) => {
    try {
        const createdUser = await prisma.user.create({
            data: {
                zid,
                email,
                password,
                userType,
            },
        });
        console.log("User created", createdUser);
    } catch (error) {
        console.log(error);
        throw new Error("An database error occurred");
    }
};

export const dbFindUserByEmail = async (email: string) => {
    return await prisma.user.findFirst({
        where: {
            email: email,
        },
    });
};

export const dbFindJwtUserByZid = async (zid: string): Promise<JwtUser> => {
    const jwtUser =  await prisma.user.findFirst({
        where: {
            zid: zid,
        },
        select: {
            zid: true,
            email: true,
            userType: true,
            profile: {
                select: {
                    fullname: true,
                },
            },
        }
    });

    if (!jwtUser) {
        throw new Error("User not found");
    }

    if (!jwtUser.profile) {
        throw new Error("Profile not found");
    }

    return {
        zid: jwtUser.zid,
        email: jwtUser.email,
        userType: jwtUser.userType,
        fullname: jwtUser.profile.fullname,
        
    };
}

export const dbSetResetToken = async (email: string, resetToken: string) => {
    try {
        await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                resetToken: resetToken,
            },
        });
    } catch (error) {
        console.log(error);
        throw new Error("An database error occurred");
    }
}

export const dbSetNewPassword = async (resetToken: string, newPassword: string) => {
    try {
        await prisma.user.update({
            where: {
                resetToken: resetToken,
            },
            data: {
                password: newPassword,
                resetToken: null,
            },
        })
        console.log("updated")
    } catch (error) {
        console.log(error);
        throw error;
    }
}