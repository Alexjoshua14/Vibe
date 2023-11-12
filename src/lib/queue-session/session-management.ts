"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"

import prisma from "../prisma"
import {
  getCurrentlyPlayingDB,
  getCurrentlyPlayingDBMember,
} from "../prisma/currentlyPlaying"
import { addSongToSuggested } from "../prisma/suggested"
import { SpotifyItem } from "../validators/spotify"

export async function createSession() {
  // Set up database objects delegating this user as the host

  // Get user information
  const session = await getServerSession(authOptions)
  console.log(session?.user.id)
  if (!session?.user.id) {
    throw new Error("No user id found")
  }

  // Create session database objects
  try {
    /** Ensure user doesn't have a currently playing already */
    let user = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
      include: {
        queue: true,
        suggested: true,
        currentlyPlaying: true,
      },
    })

    if (user == null) throw new Error("No user found..")

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
          create: {},
        },
        suggested: {
          create: {},
        },
      },
      include: {
        queue: true,
        suggested: true,
        currentlyPlaying: true,
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
        where: { id: session.user.id },
        data: {
          currentlyPlaying: {
            create: {
              userId: session.user.id,
              queueId: user.queueId,
              suggestedId: user.suggestedId,
            },
          },
        },
        include: {
          currentlyPlaying: true,
          queue: true,
          suggested: true,
        },
      })

      /* Ensure currently playing was created */
      if (!user.currentlyPlayingId) {
        throw new Error("Failed to create currently playing")
      }
      let cp = prisma.currentlyPlaying.findFirst({
        where: {
          id: user.currentlyPlayingId,
          userId: user.id,
        },
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
    console.error(err)
    return false
  }

  // Send user to delegated page
}

/** This should destroy a session completely */
export async function destroySession() {
  // Clean up database structures and handle any lingering users still connected
  // Get user information
  const session = await getServerSession(authOptions)
  console.log(session?.user.id)
  if (!session?.user.id) {
    throw new Error("No user id found")
  }

  try {
    /** Ensure user doesn't have a currently playing already */
    let user = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
      include: {
        queue: true,
        suggested: true,
        currentlyPlaying: true,
      },
    })

    if (user === null) {
      throw new Error("No user found in database")
    }

    /** TODO: Handle any lingering queue listeners */

    /** Destroy queue, suggested, and currentlyPlaying */
    let queuePromise
    let suggestedPromise
    let currentlyPlayingPromise

    let userPromise = prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        queueId: null,
      },
    })

    if (user.currentlyPlayingId)
      currentlyPlayingPromise = prisma.currentlyPlaying.delete({
        where: {
          userId: session.user.id,
          id: user.currentlyPlayingId,
        },
      })

    if (user.queueId)
      queuePromise = prisma.queue.delete({
        where: {
          id: user.queueId,
        },
      })

    if (user.suggestedId)
      suggestedPromise = prisma.suggested.delete({
        where: {
          id: user.suggestedId,
        },
      })

    let promiseArray = await Promise.all([
      userPromise,
      currentlyPlayingPromise,
      queuePromise,
      suggestedPromise,
    ])
    console.log("Promise Array: \n" + JSON.stringify(promiseArray))
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

// TODO: Speed this call up, currently seems to have a noticeable delay
export async function listAllSessions() {
  // Get user information
  const session = await getServerSession(authOptions)
  console.log(session?.user.id)
  if (!session?.user.id) {
    throw new Error("No user id found")
  }

  // TODO: Limit this function so that only certain sessions are available
  // to be shown to users based on friends and/or proximity

  const availableSessions = await prisma.currentlyPlaying.findMany()

  return availableSessions
}

export async function getQueueSession(sessionId: string) {
  const queueSession = await prisma.currentlyPlaying.findFirst({
    where: {
      id: sessionId,
    },
  })

  /** TODO: Validate that the user is allowed access to this specific queue session */

  return queueSession
}

export async function addSongToQueue(song: SpotifyItem) {
  console.log("TESTING TESTING")
  // Grab the user who is trying to add a song

  // Check if they are the host, a member, or not actually connected to the queue in any meaningful way

  // If host, add song directly to spotify queue and perhaps also to db queue

  // If member, add song to currentlyPlaying's suggested songs list

  const userSession = await getServerSession(authOptions)
  if (userSession === null) {
    console.error("There doesn't seem to be a user connected to this session..")
    return false
  }

  let user = await prisma.user.findFirst({
    where: { id: userSession.user.id },
    select: {
      currentlyPlaying: {
        include: { queue: true, suggested: true, members: true },
      },
    },
  })
  const cp = user?.currentlyPlaying

  if (cp === null || cp === undefined) {
    console.error("No currently playing structure found in the database..")
    return false
  }

  if (cp.userId === userSession.user.id) {
    // User is the host so we can add the song directly to queues
    console.log("User identified as currently playing session host")
    // Add to spotify queue

    // Add to database queue
  }

  if (
    cp.members.filter((member) => member.id === userSession.user.id).length > 0
  ) {
    // User is a member so we can add the song to suggested
    console.log("Adding song to suggested")
    const res = addSongToSuggested(song)
  } else {
    console.log("User is not found in the currently Playing member list..")
    return false
  }

  return true
}

export async function removeUserFromSession() {
  const user = await getServerSession(authOptions)

  if (!user) {
    console.error("No user found..")
    return false
  }

  // TODO: IMPLMEMENT CHECK TO MAKE SURE THIS WENT THROUGH
  const res = await prisma.user.update({
    where: {
      id: user.user.id,
    },
    data: {
      currentlyPlayingId: null,
    },
  })

  return true
}
