-- CreateTable
CREATE TABLE `Notification` (
    `zid` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `sentWhen` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `msgRead` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`zid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_zid_fkey` FOREIGN KEY (`zid`) REFERENCES `User`(`zid`) ON DELETE RESTRICT ON UPDATE CASCADE;
