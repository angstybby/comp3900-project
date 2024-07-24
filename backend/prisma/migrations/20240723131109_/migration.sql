/*
  Warnings:

  - A unique constraint covering the columns `[skillName]` on the table `Skills` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `CourseSkill` (
    `courseId` VARCHAR(191) NOT NULL,
    `skillId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,

    PRIMARY KEY (`courseId`, `skillId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Skills_skillName_key` ON `Skills`(`skillName`);

-- AddForeignKey
ALTER TABLE `CourseSkill` ADD CONSTRAINT `CourseSkill_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseSkill` ADD CONSTRAINT `CourseSkill_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `Skills`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
