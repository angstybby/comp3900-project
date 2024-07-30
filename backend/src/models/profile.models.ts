import { PrismaClient, Profile } from "@prisma/client";

const prisma = new PrismaClient();

// add profile to database
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

// get a profile from database
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

// update a profile from database
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
                CareerPath: profile.CareerPath,
            },
        });
        return user;
    } catch (e) {
        console.log(e);
        throw new Error("An database error occurred");
    }
};

// get user type of user given their zid from database
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

// get all students from database
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

// get a user's skills from database
export const dbGetUserSkills = async (zid: string) => {
  try {
      const user = await prisma.profile.findUnique({
          where: {
              zid: zid,
          },
          select: {
              zid: true,
              CareerPath: true,
              Skills: {
                  select: {
                      skillName: true,
                  },
              },
          },
      });

      if (!user) {
          throw new Error("User does not exist");
      }

      return user;
  } catch (error) {
      console.error("Error getting user skills:", error);
      throw error;
  }
};
