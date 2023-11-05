"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"

import prisma from "../prisma"
import { CurrentlyPlaying } from "../validators/spotify"

export async function getCurrentlyPlayingDB(includeQueue?: boolean, includeSuggested?: boolean, includeMembers?: boolean) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      throw new Error("No session detected..")
    }

    const cp = await prisma.currentlyPlaying.findFirst({
      where: {
        userId: session.user.id
      },
      include: {
        song: {
          include: {
            artists: true
          }
        },
        queue: includeQueue,
        suggested: includeSuggested,
        members: includeMembers, 
      }
    })

    return cp ?? null
  } catch (err) {
    console.error(err)
  }

  return null 
}

export async function updateCurrentlyPlayingDB(currentlyPlaying: CurrentlyPlaying, includeQueue?: boolean, includeSuggested?: boolean, includeMembers?: boolean) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      throw new Error("No session detected..")
    }

    let cp = await prisma.currentlyPlaying.findFirst({
      where: {
        userId: session.user.id
      },
      include: {
        song: {
          include: {
            artists: true
          }
        },
        queue: includeQueue,
        suggested: includeSuggested,
        members: includeMembers, 
      }
    })

    let artists

    if (cp?.song?.uri !== currentlyPlaying.item.uri) {
      artists = currentlyPlaying.item.artists.map((artist) => (
        {
          name: artist.name,
          href: artist.href,
          uri: artist.uri,
        }
      ))

      let song = await prisma.song.create({
        data: {
          name: currentlyPlaying.item.name,
          duration_ms: currentlyPlaying.item.duration_ms,
          href: currentlyPlaying.item.href,
          uri: currentlyPlaying.item.uri,
          type: currentlyPlaying.item.type,
          explicit: currentlyPlaying.item.explicit,
          popularity: currentlyPlaying.item.popularity,
          artists: {
            create: {
              ...artists[0],
            }
          },
          album: {
            create: {
              href: currentlyPlaying.item.album.href,
              name: currentlyPlaying.item.album.name,
              uri: currentlyPlaying.item.album.uri,
              images: {
                create: {
                  height: currentlyPlaying.item.album.images[0].height,
                  width: currentlyPlaying.item.album.images[0].width,
                  url: currentlyPlaying.item.album.images[0].url
                }
              }
            }
          }
        } 
      })

      cp = await prisma.currentlyPlaying.update({
        where: {
        userId: session.user.id
        },
        data: {
          is_playing: currentlyPlaying.is_playing,
          progress_ms: currentlyPlaying.progress_ms,
          songId: song.id
        },
        include: {
          song: {
          include: {
            artists: true
          }
        },
          queue: includeQueue,
          suggested: includeSuggested,
          members: includeMembers, 
        }
      })
    } else {
      cp = await prisma.currentlyPlaying.update({
        where: {
          userId: session.user.id
        },
        data: {
          is_playing: currentlyPlaying.is_playing,
          progress_ms: currentlyPlaying.progress_ms,
        },
        include: {
          song: {
          include: {
            artists: true
          }
        },
          queue: includeQueue,
          suggested: includeSuggested,
          members: includeMembers, 
        }
      })
    }

    return cp
    
  } catch (err) {
    console.error(err)
  }

  return null
}