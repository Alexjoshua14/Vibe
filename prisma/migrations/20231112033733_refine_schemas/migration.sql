-- DropForeignKey
ALTER TABLE "CurrentlyPlaying" DROP CONSTRAINT "CurrentlyPlaying_queueId_fkey";

-- DropForeignKey
ALTER TABLE "CurrentlyPlaying" DROP CONSTRAINT "CurrentlyPlaying_suggestedId_fkey";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_albumId_fkey";

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentlyPlaying" ADD CONSTRAINT "CurrentlyPlaying_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentlyPlaying" ADD CONSTRAINT "CurrentlyPlaying_suggestedId_fkey" FOREIGN KEY ("suggestedId") REFERENCES "Suggested"("id") ON DELETE CASCADE ON UPDATE CASCADE;
