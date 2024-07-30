-- CreateTable
CREATE TABLE `Feedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fromZid` VARCHAR(191) NOT NULL,
    `toZid` VARCHAR(191) NOT NULL,
    `comment` TEXT NOT NULL,
    `rating` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_fromZid_fkey` FOREIGN KEY (`fromZid`) REFERENCES `Profile`(`zid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_toZid_fkey` FOREIGN KEY (`toZid`) REFERENCES `Profile`(`zid`) ON DELETE RESTRICT ON UPDATE CASCADE;
