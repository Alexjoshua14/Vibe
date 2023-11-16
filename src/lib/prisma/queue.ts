"use server"

import { Album, Artist, Image, Queue, Song } from "@prisma/client"
import { getServerSession } from "next-auth"

import { authOptions } from "@/utilities/OAuth/authOptions"

import prisma from "../prisma"

export async function getQueue(queueId: string) {
  return await prisma.queue.findFirst({
    where: {
      id: queueId,
    },
  })
}

export async function getUserQueued() {
  const user = await getServerSession(authOptions)
  const userId = user?.user?.id
  let queue:
    | (Queue & {
        songs: (Song & {
          artists: Artist[]
          album: Album & { images: Image[] }
        })[]
      })
    | null = null

  if (userId) {
    queue = await prisma.user
      .findFirst({
        where: {
          id: userId,
        },
        select: {
          queue: {
            include: {
              songs: {
                include: {
                  artists: true,
                  album: {
                    include: {
                      images: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
      .then((queueWrapped) => queueWrapped?.queue ?? null)
  }
  return queue
}
