"use server"

import prisma from "../prisma"

export async function getUser(userId: string) {
  return await prisma.user.findFirst({
    where: {
      id: userId,
    },
  })
}

export async function getUserDeep(userId: string) {
  return await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      currentlyPlaying: true,
      queue: true,
      suggested: true,
      posts: true,
    },
  })
}
