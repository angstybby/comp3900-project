-- AlterTable
ALTER TABLE `Profile` ADD COLUMN `profilePicture` VARCHAR(191) NULL,
    ADD COLUMN `userType` ENUM('student', 'academic', 'admin') NULL;
