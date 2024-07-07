-- CreateTable
CREATE TABLE `GroupInterest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `groupId` INTEGER NOT NULL,
    `zid` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'DENIED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `GroupInterest_groupId_zid_key`(`groupId`, `zid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GroupInterest` ADD CONSTRAINT `GroupInterest_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupInterest` ADD CONSTRAINT `GroupInterest_zid_fkey` FOREIGN KEY (`zid`) REFERENCES `Profile`(`zid`) ON DELETE RESTRICT ON UPDATE CASCADE;
