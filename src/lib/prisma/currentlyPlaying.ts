"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "@/utilities/OAuth/authOptions"

import prisma from "../prisma"
import { CurrentlyPlaying } from "../validators/spotify"

export async function getCurrentlyPlayingDB(
  includeQueue?: boolean,
  includeSuggested?: boolean,
  includeMembers?: boolean,
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      throw new Error("No session detected..")
    }

    const cp = await prisma.currentlyPlaying.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        song: {
          include: {
            artists: true,
          },
        },
        queue: includeQueue,
        suggested: includeSuggested,
        members: includeMembers,
      },
    })

    return cp ?? null
  } catch (err) {
    console.error(err)
  }

  return null
}

export async function getCurrentlyPlayingDBMember(
  cpId: string | undefined,
  includeQueue?: boolean,
  includeSuggested?: boolean,
  includeMembers?: boolean,
) {
  if (cpId === undefined) return null

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
          },
        },
        queue: includeQueue,
        suggested: includeSuggested,
        members: includeMembers,
      },
    })

    return cp ?? null
  } catch (err) {
    console.error(err)
  }

  return null
}

export async function updateCurrentlyPlayingDB(
  currentlyPlaying: CurrentlyPlaying,
  includeQueue?: boolean,
  includeSuggested?: boolean,
  includeMembers?: boolean,
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      throw new Error("No session detected..")
    }

    let cp = await prisma.currentlyPlaying.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        song: {
          include: {
            artists: true,
          },
        },
        queue: includeQueue,
        suggested: includeSuggested,
        members: includeMembers,
      },
    })

    let artists

    if (currentlyPlaying.item && cp?.song?.uri !== currentlyPlaying.item.uri) {
      artists = currentlyPlaying.item.artists.map((artist) => ({
        name: artist.name,
        href: artist.href,
        uri: artist.uri,
      }))

      let song = await prisma.song.upsert({
        where: {
          uri: currentlyPlaying.item.uri,
        },
        update: {},
        create: {
          id: currentlyPlaying.item.id,
          name: currentlyPlaying.item.name,
          duration_ms: currentlyPlaying.item.duration_ms,
          href: currentlyPlaying.item.href,
          uri: currentlyPlaying.item.uri,
          type: currentlyPlaying.item.type,
          explicit: currentlyPlaying.item.explicit,
          popularity: currentlyPlaying.item.popularity,
          artists: {
            connectOrCreate: {
              where: {
                uri: artists[0].uri,
              },
              create: {
                ...artists[0],
              },
            },
          },
          album: {
            connectOrCreate: {
              where: {
                uri: currentlyPlaying.item.album.uri,
              },
              create: {
                href: currentlyPlaying.item.album.href,
                name: currentlyPlaying.item.album.name,
                uri: currentlyPlaying.item.album.uri,
                images: {
                  create: {
                    height: currentlyPlaying.item.album.images[0].height,
                    width: currentlyPlaying.item.album.images[0].width,
                    url: currentlyPlaying.item.album.images[0].url,
                  },
                },
              },
            },
          },
        },
      })

      cp = await prisma.currentlyPlaying.update({
        where: {
          userId: session.user.id,
        },
        data: {
          is_playing: currentlyPlaying.is_playing,
          progress_ms: currentlyPlaying.progress_ms,
          song: {
            connect: {
              id: song.id,
            },
          },
        },
        include: {
          song: {
            include: {
              artists: true,
            },
          },
          queue: includeQueue,
          suggested: includeSuggested,
          members: includeMembers,
        },
      })
    } else {
      cp = await prisma.currentlyPlaying.update({
        where: {
          userId: session.user.id,
        },
        data: {
          is_playing: currentlyPlaying.is_playing,
          progress_ms: currentlyPlaying.progress_ms,
        },
        include: {
          song: {
            include: {
              artists: true,
            },
          },
          queue: includeQueue,
          suggested: includeSuggested,
          members: includeMembers,
        },
      })
    }

    return cp
  } catch (err) {
    console.error(err)
  }

  return null
}

export async function addUserToSession(sessionId: string) {
  const user = await getServerSession(authOptions)
  if (user === null) {
    console.log("No user found..")
    return false
  }

  const cp = await prisma.currentlyPlaying.findFirst({
    where: { id: sessionId },
    select: { members: true },
  })

  if (cp === null) {
    console.log("No session found with id matching the one provided..")
    return false
  }

  // Adds user to the currently playing database object's member array
  await prisma.currentlyPlaying.update({
    where: {
      id: sessionId,
    },
    data: {
      members: {
        connect: {
          id: user.user.id,
        },
      },
    },
  })
}

/**
 * Checks if the user has a currently playing session in the database
 */
export async function reconnect() {
  console.log("Searching for previous session..")
  const user = await getServerSession(authOptions)
  if (user === null) {
    console.log("No user found..")
    return { cpID: null, prevStatus: "IDLE" }
  }

  const userDB = await prisma.user.findFirst({
    where: { id: user.user.id },
    include: { currentlyPlaying: true },
  })

  if (userDB?.currentlyPlaying === null) {
    console.log("No session found with id matching the one provided..")
    return { cpID: null, prevStatus: null }
  }

  const prevStatus: "HOST" | "MEMBER" =
    userDB?.currentlyPlaying.userId === user.user.id ? "HOST" : "MEMBER"

  return { cpID: userDB?.currentlyPlayingId, prevStatus }
}

const disconectSongFromCurrentlyPlaying = async (
  userId: string,
  includeQueue?: boolean,
  includeSuggested?: boolean,
  includeMembers?: boolean,
) => {
  return await prisma.currentlyPlaying.update({
    where: {
      userId: userId,
    },
    data: {
      song: {
        disconnect: true,
      },
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
                },
              },
            },
          },
        },
      },
      queue: includeQueue,
      suggested: includeSuggested,
      members: includeMembers,
    },
  })
}

/**
 * Takes a CurrentlyPlaying object and uses it to update the database
 *
 * @param userId
 * @param currentlyPlaying
 * @returns Updated currentlyPlaying from database
 */
export const spotifyCurrentlyPlayingToDatabase = async (
  userId: string,
  currentlyPlaying: CurrentlyPlaying,
  includeQueue?: boolean,
  includeSuggested?: boolean,
  includeMembers?: boolean,
) => {
  // If song is null or undefined, disconnect song from currently playing
  // Else, connect or create song
  let currentlyPlayingDB =
    currentlyPlaying.item === null || currentlyPlaying.item === undefined
      ? await disconectSongFromCurrentlyPlaying(
          userId,
          includeQueue,
          includeSuggested,
          includeMembers,
        )
      : await prisma.currentlyPlaying.update({
          where: {
            userId: userId,
          },
          data: {
            progress_ms: currentlyPlaying.progress_ms,
            song: {
              connectOrCreate: {
                where: {
                  uri: currentlyPlaying.item.uri,
                },
                create: {
                  uri: currentlyPlaying.item.uri,
                  name: currentlyPlaying.item.name,
                  duration_ms: currentlyPlaying.item.duration_ms,
                  href: currentlyPlaying.item.href,
                  explicit: currentlyPlaying.item.explicit,
                  popularity: currentlyPlaying.item.popularity,
                  type: currentlyPlaying.item.type,
                  album: {
                    connectOrCreate: {
                      where: {
                        uri: currentlyPlaying.item.album.uri,
                      },
                      create: {
                        uri: currentlyPlaying.item.album.uri,
                        name: currentlyPlaying.item.album.name,
                        href: currentlyPlaying.item.album.href,
                        images: {
                          create: currentlyPlaying.item.album.images,
                        },
                      },
                    },
                  },
                  artists: {
                    connectOrCreate: currentlyPlaying.item.artists.map(
                      (artist) => {
                        return {
                          where: {
                            uri: artist.uri,
                          },
                          create: {
                            uri: artist.uri,
                            name: artist.name,
                            href: artist.href,
                          },
                        }
                      },
                    ),
                  },
                },
              },
            },
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
                      },
                    },
                  },
                },
              },
            },
            queue: includeQueue,
            suggested: includeSuggested,
            members: includeMembers,
          },
        })

  return currentlyPlayingDB
}
