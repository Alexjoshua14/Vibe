-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_queueId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "queueId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
