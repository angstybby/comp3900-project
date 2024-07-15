/*
  Warnings:

  - You are about to drop the column `skills` on the `Course` table. All the data in the column will be lost.
  - Added the required column `MaxMembers` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Course` DROP COLUMN `skills`;

-- AlterTable
ALTER TABLE `Group` ADD COLUMN `MaxMembers` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Skills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skillName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProfileToSkills` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProfileToSkills_AB_unique`(`A`, `B`),
    INDEX `_ProfileToSkills_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CourseToSkills` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CourseToSkills_AB_unique`(`A`, `B`),
    INDEX `_CourseToSkills_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GroupToSkills` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GroupToSkills_AB_unique`(`A`, `B`),
    INDEX `_GroupToSkills_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProjectToSkills` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProjectToSkills_AB_unique`(`A`, `B`),
    INDEX `_ProjectToSkills_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ProfileToSkills` ADD CONSTRAINT `_ProfileToSkills_A_fkey` FOREIGN KEY (`A`) REFERENCES `Profile`(`zid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProfileToSkills` ADD CONSTRAINT `_ProfileToSkills_B_fkey` FOREIGN KEY (`B`) REFERENCES `Skills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToSkills` ADD CONSTRAINT `_CourseToSkills_A_fkey` FOREIGN KEY (`A`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToSkills` ADD CONSTRAINT `_CourseToSkills_B_fkey` FOREIGN KEY (`B`) REFERENCES `Skills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GroupToSkills` ADD CONSTRAINT `_GroupToSkills_A_fkey` FOREIGN KEY (`A`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GroupToSkills` ADD CONSTRAINT `_GroupToSkills_B_fkey` FOREIGN KEY (`B`) REFERENCES `Skills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectToSkills` ADD CONSTRAINT `_ProjectToSkills_A_fkey` FOREIGN KEY (`A`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectToSkills` ADD CONSTRAINT `_ProjectToSkills_B_fkey` FOREIGN KEY (`B`) REFERENCES `Skills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
