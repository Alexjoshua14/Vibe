/*
  Warnings:

  - A unique constraint covering the columns `[uri]` on the table `Album` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uri]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uri]` on the table `Song` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Album_uri_key" ON "Album"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_uri_key" ON "Artist"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "Song_uri_key" ON "Song"("uri");
