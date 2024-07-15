-- CreateTable
CREATE TABLE `ProjectInterest` (
    `projectId` INTEGER NOT NULL,
    `GroupId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'DENIED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`projectId`, `GroupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectInterest` ADD CONSTRAINT `ProjectInterest_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectInterest` ADD CONSTRAINT `ProjectInterest_GroupId_fkey` FOREIGN KEY (`GroupId`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
