import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dbGetAllUsersExcept = async (toExclude: string): Promise<any> => {
  try {
    const users = await prisma.user.findMany({
      where: {
        zid: {
          not: toExclude,
        }
      },
      include: {
        profile: true,
      }
    });
    if (!users) {
      throw new Error('Failed in retrieving users')
    }
    return users;
  } catch (e) {
    console.log(e);
    throw new Error("An database error occurred");
  }
}

export const dbRemoveUser = async (zid: string): Promise<any> => {
  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.profile.delete({
        where: {
          zid: zid,
        },
      });

      await prisma.user.delete({
        where: {
          zid: zid,
        },
      });
    });

    console.log(`User and profile with zid ${zid} deleted successfully.`);
  } catch (e) {
    console.log(e);
    throw new Error('Could not delete user and profile');
  }
}