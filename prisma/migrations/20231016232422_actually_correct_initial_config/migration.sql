-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_suggestedId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "suggestedId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_suggestedId_fkey" FOREIGN KEY ("suggestedId") REFERENCES "Suggested"("id") ON DELETE SET NULL ON UPDATE CASCADE;
