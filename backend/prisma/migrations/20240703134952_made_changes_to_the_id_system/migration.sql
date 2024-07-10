/*
  Warnings:

  - The primary key for the `Group` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Group` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `GroupJoined` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `groupId` on the `GroupJoined` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `ProjectTaken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `projectId` on the `ProjectTaken` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `groupId` on the `ProjectTaken` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `GroupJoined` DROP FOREIGN KEY `GroupJoined_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `ProjectTaken` DROP FOREIGN KEY `ProjectTaken_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `ProjectTaken` DROP FOREIGN KEY `ProjectTaken_projectId_fkey`;

-- AlterTable
ALTER TABLE `Group` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `GroupJoined` DROP PRIMARY KEY,
    MODIFY `groupId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`zid`, `groupId`);

-- AlterTable
ALTER TABLE `Project` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `ProjectTaken` DROP PRIMARY KEY,
    MODIFY `projectId` INTEGER NOT NULL,
    MODIFY `groupId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`projectId`, `groupId`);

-- AddForeignKey
ALTER TABLE `GroupJoined` ADD CONSTRAINT `GroupJoined_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectTaken` ADD CONSTRAINT `ProjectTaken_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectTaken` ADD CONSTRAINT `ProjectTaken_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
