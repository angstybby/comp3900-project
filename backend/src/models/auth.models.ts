import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface User {
    zid: string;
    email: string;
    password: string;
    fullname: string;
}

export const dbAddUser = async (user: User) => {
    prisma.user
        .create({
            data: user,
        })
        .then((user) => {
            console.log("User created", user);
        })
        .catch((error) => {
            console.log(error);
            throw new Error("An database error occurred");
        });
};

export const dbFindUserByEmail = async (email: string) => {
    return prisma.user.findFirst({
        where: {
            email: email,
        },
    });
};
