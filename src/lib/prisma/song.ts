"use server"

import { Song } from "@prisma/client"

export const getSongImage = async (albumId: string) => {
  const image = await prisma?.image.findFirst({
    where: {
      albumId: albumId,
    },
  })

  return image
}

export const createSong = async (song: Song) => {
  const res = await prisma?.song.create({
    data: {
      ...song,
    },
  })

  return res
}
