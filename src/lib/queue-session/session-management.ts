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

    const user = await prisma.user.update({
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

    await prisma.user.update({
      where: {id: session.user.id},
      data: {
        currentlyPlaying: {
          create: {
            userId: session.user.id,
            queueId: user.queueId,
            suggestedId: user.suggestedId,
          }
        }
      }
    })
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