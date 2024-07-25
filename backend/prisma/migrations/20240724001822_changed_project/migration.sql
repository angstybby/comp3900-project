/*
  Warnings:

  - You are about to drop the column `groupId` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_groupId_fkey`;

-- AlterTable
ALTER TABLE `Project` DROP COLUMN `groupId`;

-- CreateTable
CREATE TABLE `_GroupToProject` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GroupToProject_AB_unique`(`A`, `B`),
    INDEX `_GroupToProject_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_GroupToProject` ADD CONSTRAINT `_GroupToProject_A_fkey` FOREIGN KEY (`A`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GroupToProject` ADD CONSTRAINT `_GroupToProject_B_fkey` FOREIGN KEY (`B`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
