import { $Enums, PrismaClient, User, UserType } from "@prisma/client";

const prisma = new PrismaClient();

export interface JwtUser {
    zid: string;
    email: string;
    fullname: string;
    userType: UserType;
}

// add notification to database
export const dbAddNotification = async (
    zid: string,
    action: string
) => {
    try {
        const createdNotification = await prisma.notification.create({
            data: {
                zid,
                action,
            },
        });
        console.log("Notification created", createdNotification);
    } catch (error) {
        console.log(error);
        throw new Error("A database error occurred");
    }
};

// add user to database
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

// find user by email in database
export const dbFindUserByEmail = async (email: string) => {
    return await prisma.user.findFirst({
        where: {
            email: email,
        },
    });
};

// find user by zid in database
export const dbFindUserByZid = async (zid: string) => {
    return await prisma.user.findFirst({
        where: {
            zid: zid,
        },
    });
};

// find jwt user by zid in database
export const dbFindJwtUserByZid = async (zid: string): Promise<JwtUser> => {
    const jwtUser = await prisma.user.findFirst({
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
        },
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
};

// set a reset token in database
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
};

// set new password in database
export const dbSetNewPassword = async (
    resetToken: string,
    newPassword: string,
) => {
    try {
        await prisma.user.update({
            where: {
                resetToken: resetToken,
            },
            data: {
                password: newPassword,
                resetToken: null,
            },
        });
        console.log("updated");
    } catch (error) {
        console.log(error);
        throw error;
    }
};
