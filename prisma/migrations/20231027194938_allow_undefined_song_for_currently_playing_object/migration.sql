-- DropForeignKey
ALTER TABLE "CurrentlyPlaying" DROP CONSTRAINT "CurrentlyPlaying_songId_fkey";

-- AlterTable
ALTER TABLE "CurrentlyPlaying" ALTER COLUMN "songId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CurrentlyPlaying" ADD CONSTRAINT "CurrentlyPlaying_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE SET NULL ON UPDATE CASCADE;
