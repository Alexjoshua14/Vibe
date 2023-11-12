"use server"

import { Album, Artist, Image, Song, Suggested } from "@prisma/client"
import { getServerSession } from "next-auth"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { addToQueue, getSong } from "@/utilities/spotifyAPI"

import prisma from "../prisma"
import { SpotifyItem } from "../validators/spotify"

export async function getSuggested(suggestedId: string) {
  return await prisma.suggested.findFirst({
    where: {
      id: suggestedId,
    },
  })
}

export async function getUserSuggested() {
  const user = await getServerSession(authOptions)
  const userId = user?.user?.id
  let suggested:
    | (Suggested & {
        songs: (Song & {
          artists: Artist[]
          album: Album & { images: Image[] }
        })[]
      })
    | null = null

  if (userId) {
    suggested = await prisma.user
      .findFirst({
        where: {
          id: userId,
        },
        select: {
          suggested: {
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
      .then((suggestedWrapped) => suggestedWrapped?.suggested ?? null)
  }

  console.log(JSON.stringify(suggested, null, 2))

  return suggested
}

export async function addSongToSuggested(song: SpotifyItem) {
  const user = await getServerSession(authOptions)
  const userId = user?.user?.id
  if (!userId) return false

  const suggestedId = await prisma.user
    .findFirst({
      where: {
        id: userId,
      },
      select: {
        currentlyPlaying: true,
      },
    })
    .then((wrapped) => wrapped?.currentlyPlaying?.suggestedId ?? null)

  console.log("Suggested id was found to be: ", suggestedId)

  if (!suggestedId) return false

  const artistsPromises = song.artists.map((artist) => {
    return prisma.artist.upsert({
      where: {
        uri: artist.uri,
      },
      update: {},
      create: {
        name: artist.name,
        href: artist.href,
        uri: artist.uri,
      },
    })
  })

  const artists = await Promise.all(artistsPromises)

  const album = await prisma.album.upsert({
    where: {
      uri: song.album.uri,
    },
    update: {},
    create: {
      name: song.album.name,
      href: song.album.href,
      uri: song.album.uri,
      images: {
        create: song.album.images.map((image) => ({
          url: image.url,
          width: image.width,
          height: image.height,
        })),
      },
      artists: {
        connect: artists.map((artist) => ({ id: artist.id })),
      },
    },
  })

  const songDB = await prisma.song.create({
    data: {
      duration_ms: song.duration_ms,
      explicit: song.explicit,
      href: song.href,
      name: song.name,
      popularity: song.popularity,
      uri: song.uri,
      type: song.type,
      album: {
        connect: {
          id: album.id,
        },
      },
      artists: {
        connect: artists.map((artist) => ({ id: artist.id })),
      },
    },
  })

  console.log("Song was created: ", songDB)

  const res = await prisma.suggested.update({
    where: {
      id: suggestedId,
    },
    data: {
      songs: {
        connect: {
          id: songDB.id,
        },
      },
    },
  })

  console.log("Song should be connected to suggested")
}

export async function acceptSuggestedSong(
  songId: string,
) {
  // Add to actual spotify queue
  const user = await getServerSession(authOptions)
  if (!user?.accessToken)
    throw new Error("No access token found")

  const ids = await prisma.user.findFirst({
    where: {
      id: user?.user?.id,
    },
    select: {
      queueId: true,
      suggestedId: true,
    }
  })

  if (ids === null || ids.queueId === null || ids.suggestedId === null) 
    throw new Error("No queue and/or suggested id found")

  const { uri } = await prisma.song.findFirst({
    where: {
      id: songId,
    },
    select: {
      uri: true
    }
  }) ?? { uri: null }

  if (uri === null)
    throw new Error("No song uri found")


  const res = await addToQueue(user?.accessToken, uri)

  if (res === false) 
    return false

  const queue = await prisma.queue.update({
    where: {
      id: ids.queueId,
    },
    data: {
      songs: {
        connect: {
          id: songId,
        },
      },
    },
    include: {
      songs: true,
    },
  })

  // TODO: Better handle this error.
  // TLDT(Too Long Don't Think): This error is essentially
  // indicative of whether the provided song id is now
  // found within the queue after the attempt to update it.
  if (queue.songs.filter((song) => song.id === songId).length === 0)
    return false

  // UNIT TEST CASE: Ensure that suggested song is removed from suggested
  const suggested = await prisma.suggested.update({
    where: {
      id: ids.suggestedId,
    },
    data: {
      songs: {
        disconnect: {
          id: songId,
        },
      },
    },
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
  })

  return { queue, suggested }
}
