/*
  Warnings:

  - The primary key for the `ProjectInterest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `GroupId` on the `ProjectInterest` table. All the data in the column will be lost.
  - You are about to drop the `ProjectTaken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `groupId` to the `ProjectInterest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ProjectInterest` DROP FOREIGN KEY `ProjectInterest_GroupId_fkey`;

-- DropForeignKey
ALTER TABLE `ProjectTaken` DROP FOREIGN KEY `ProjectTaken_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `ProjectTaken` DROP FOREIGN KEY `ProjectTaken_projectId_fkey`;

-- AlterTable
ALTER TABLE `Project` ADD COLUMN `groupId` INTEGER NULL;

-- AlterTable
ALTER TABLE `ProjectInterest` DROP PRIMARY KEY,
    DROP COLUMN `GroupId`,
    ADD COLUMN `groupId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`projectId`, `groupId`);

-- DropTable
DROP TABLE `ProjectTaken`;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectInterest` ADD CONSTRAINT `ProjectInterest_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
