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