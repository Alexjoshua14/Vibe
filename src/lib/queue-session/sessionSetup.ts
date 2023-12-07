"use server"

import { getServerSession } from "next-auth"

import prisma from "@/lib/prisma"
import { authOptions } from "@/utilities/OAuth/authOptions"

/* TODO: Pull this interface out into a proper location */
export interface AvailableSession {
  id: string
  hostName: string
}

/* TODO: Augment this function to allow for selecting from a set of predefined filters such as sessions from friends of user
 * or publicly listed sessions
 */
export async function getAvailableSessions() {
  const user = await getServerSession(authOptions)
  if (!user) {
    throw new Error("No user found..")
  }

  const avaialableSessions = await prisma.currentlyPlaying.findMany({
    select: { id: true, userId: true },
  })

  let sessionWithUserPromises = avaialableSessions.map(async (session) => {
    const user = await prisma.user.findFirst({
      where: { id: session.userId },
      select: { name: true },
    })
    let hostName = user?.name ?? "Unknown"
    return { id: session.id, hostName: hostName } as AvailableSession
  })

  const sessionsWithUsers = await Promise.all(sessionWithUserPromises)

  return sessionsWithUsers
}
