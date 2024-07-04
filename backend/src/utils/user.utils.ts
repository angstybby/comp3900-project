import { User } from "@prisma/client";

export const removeUnwantedFields = (users: User[]): any[] => {
  return users.map(user => {
    const { password, isAdmin, updatedAt, resetToken, ...rest } = user;
    return rest;
  });
} 