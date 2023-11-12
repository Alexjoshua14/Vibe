/*
  Warnings:

  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Song` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "CurrentlyPlaying" DROP CONSTRAINT "CurrentlyPlaying_songId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_songId_fkey";

-- DropForeignKey
ALTER TABLE "_ArtistToSong" DROP CONSTRAINT "_ArtistToSong_B_fkey";

-- DropForeignKey
ALTER TABLE "_QueueToSong" DROP CONSTRAINT "_QueueToSong_B_fkey";

-- DropForeignKey
ALTER TABLE "_SongToSuggested" DROP CONSTRAINT "_SongToSuggested_A_fkey";

-- AlterTable
ALTER TABLE "CurrentlyPlaying" ALTER COLUMN "songId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "songId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Post_id_seq";

-- AlterTable
ALTER TABLE "Song" DROP CONSTRAINT "Song_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Song_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Song_id_seq";

-- AlterTable
ALTER TABLE "_ArtistToSong" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_QueueToSong" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_SongToSuggested" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentlyPlaying" ADD CONSTRAINT "CurrentlyPlaying_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SongToSuggested" ADD CONSTRAINT "_SongToSuggested_A_fkey" FOREIGN KEY ("A") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToSong" ADD CONSTRAINT "_ArtistToSong_B_fkey" FOREIGN KEY ("B") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QueueToSong" ADD CONSTRAINT "_QueueToSong_B_fkey" FOREIGN KEY ("B") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
