-- CreateTable
CREATE TABLE `User` (
    `zid` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`zid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `zid` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `resume` VARCHAR(191) NULL,

    PRIMARY KEY (`zid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_zid_fkey` FOREIGN KEY (`zid`) REFERENCES `User`(`zid`) ON DELETE RESTRICT ON UPDATE CASCADE;
