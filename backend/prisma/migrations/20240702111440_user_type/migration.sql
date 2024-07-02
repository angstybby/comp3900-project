/*
  Warnings:

  - You are about to drop the column `userType` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `userType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Profile` DROP COLUMN `userType`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `userType` ENUM('student', 'academic', 'admin') NOT NULL;
