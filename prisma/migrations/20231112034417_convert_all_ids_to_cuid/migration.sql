/*
  Warnings:

  - The primary key for the `Album` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Artist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Image` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_albumId_fkey";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_albumId_fkey";

-- DropForeignKey
ALTER TABLE "_AlbumToArtist" DROP CONSTRAINT "_AlbumToArtist_A_fkey";

-- DropForeignKey
ALTER TABLE "_AlbumToArtist" DROP CONSTRAINT "_AlbumToArtist_B_fkey";

-- DropForeignKey
ALTER TABLE "_ArtistToSong" DROP CONSTRAINT "_ArtistToSong_A_fkey";

-- AlterTable
ALTER TABLE "Album" DROP CONSTRAINT "Album_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Album_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Album_id_seq";

-- AlterTable
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Artist_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Artist_id_seq";

-- AlterTable
ALTER TABLE "Image" DROP CONSTRAINT "Image_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "albumId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Image_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Image_id_seq";

-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "albumId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_AlbumToArtist" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_ArtistToSong" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToSong" ADD CONSTRAINT "_ArtistToSong_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumToArtist" ADD CONSTRAINT "_AlbumToArtist_A_fkey" FOREIGN KEY ("A") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumToArtist" ADD CONSTRAINT "_AlbumToArtist_B_fkey" FOREIGN KEY ("B") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
