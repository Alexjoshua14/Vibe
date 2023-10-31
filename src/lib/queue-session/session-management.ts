'use server'

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import prisma from "../prisma"


export async function createSession() {
  // Set up database objects delegating this user as the host

  // Get user information
  const session = await getServerSession(authOptions)
  console.log(session?.user.id)
  if (!session?.user.id) {
    throw new Error('No user id found')
  }

  // Create session database objects
  try {
  // const user = await prisma.user.findFirst({
  //   where: {id: session.user.id },
  //   include: {queue: true}
  // })

  // if (user == null) {
  //   throw new Error("No user found..")
  // }


  
  

  // const currentlyPlaying = await prisma.currentlyPlaying.create({
  //   data: {
  //     userId: session.user.id,
  //     queueId: queue.id,
  //     suggestedId: '12356'
  //   }
  // })

  /** Ensure user doesn't have a currently playing already */
  let user = await prisma.user.findFirst({
    where: {
      id: session.user.id
    },
    include: {
      queue: true,
      suggested: true,
      currentlyPlaying: true
    }
  })

  if (user == null)
    throw new Error("No user found..")

  if (user.queue) {
    throw new Error("User already has queue")
  }
  if (user.suggested) {
    throw new Error("User already has suggested")
  }
  if (user.currentlyPlaying) {
    throw new Error("User already has currently playing")
  }

  /* Grab user from database */
  user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      queue: {
        create: { }
      },
      suggested: {
        create: {}
      }
    },
  })

  /* Ensure user was found and queue & suggested were created */
  if (user == null) {
    throw new Error("No user found..")
  }
  if (user.queueId == null) {
    throw new Error("Failed to instantiate queue object..")
  }
  if (user.suggestedId == null) {
    throw new Error("Failed to instantiate suggested object..")
  }

  if (user.queueId && user.suggestedId) {
    /* Create a currently playing object in database for user */
    user = await prisma.user.update({
      where: {id: session.user.id},
      data: {
        currentlyPlaying: {
          create: {
            userId: session.user.id,
            queueId: user.queueId,
            suggestedId: user.suggestedId,
          }
        }
      },
      include: {
        currentlyPlaying: true
      }
    })

    /* Ensure currently playing was created */
    if (!user.currentlyPlayingId) {
      throw new Error("Failed to create currently playing")
    }
      let cp = prisma.currentlyPlaying.findFirst({
        where: {
          id: user.currentlyPlayingId,
          userId: user.id
        }
      })

      if (!cp) {
        throw new Error("Failed to find just created currently playing object")
      }
      console.log(user.currentlyPlayingId)
      return user.currentlyPlayingId
  } else {
    throw new Error("Invalid queueId or suggestedId")
  }
} catch (err) {
  console.log(err)
}

  // Send user to delegated page

}

export async function destroySession() {
  // Clean up database structures and handle any lingering users still connected
}