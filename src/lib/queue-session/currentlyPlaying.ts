'use server'

import { getServerSession } from "next-auth"

import { mapToCurrentlyPlaying } from "@/utilities/helper"
import { authOptions } from "@/utilities/OAuth/authOptions"
import { getCurrentlyPlaying } from "@/utilities/spotifyAPI"

import prisma from "../prisma"
import { spotifyCurrentlyPlayingToDatabase } from "../prisma/currentlyPlaying"
import { CurrentlyPlaying } from "../validators/spotify"

export async function getCurrentlyPlaying_Host() {
  try {
  // Get user information
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    throw new Error("No user access token found")
  }

  // Get currently playing from Spotify
  const currentlyPlayingSpotify = await getCurrentlyPlaying(session.accessToken)

  if (currentlyPlayingSpotify === null) {
    throw new Error("No currently playing found")
  }

  // Parse currentlyPlaying to SpotifyItem ready to be stored in database
  const currentlyPlaying = mapToCurrentlyPlaying(currentlyPlayingSpotify)


  // Update database with currently playing from Spotify
  let currentlyPlayingDB = await spotifyCurrentlyPlayingToDatabase(session.user.id, currentlyPlaying, true, true, true)

  // Get payload ready for dispatch
  const payload = 
  {
    ...currentlyPlayingDB,
    timestamp: currentlyPlayingDB.timestamp.toISOString(),
    updatedAt: currentlyPlayingDB.updatedAt.toISOString(),
    queue: {
      ...currentlyPlayingDB.queue,
      updatedAt: currentlyPlayingDB.queue.updatedAt.toISOString(),
    },
    suggested: {
      ...currentlyPlayingDB?.suggested,
      updatedAt: currentlyPlayingDB?.suggested.updatedAt.toISOString(),
    },
  }

  // Return payload with currently playing ready for clientside to dispatch
  return {payload, imageURL: currentlyPlayingDB.song?.album?.images[0].url ?? ""}
  } catch (err) {
    console.error(err)
  }
  return null
}

export async function getCurrentlyPlaying_Member(cpId: string | undefined) {
  if (cpId === undefined) 
    return null

  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      throw new Error("No session detected..")
    }

    const cp = await prisma.currentlyPlaying.findFirst({
      where: {
        id: cpId,
      },
      include: {
        song: {
          include: {
            artists: true,
            album: {
              select: {
                name: true,
                images: {
                  select: {
                    url: true, 
                  }
                }
              }
            },
          },
        },
        queue: true,
        suggested: true,
        members: true,
      },
    })

    if (cp === null)
      throw new Error("No currently playing found")

    const payload = 
      {
        ...cp,
        timestamp: cp.timestamp.toISOString(),
        updatedAt: cp.updatedAt.toISOString(),
      }

    return {payload, imageURL: cp.song?.album?.images[0].url ?? ""}
    
  } catch (err) {
    console.error(err)
  }

  return null
}