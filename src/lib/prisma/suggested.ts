"use server"

import { Album, Artist, Image, Song, Suggested } from "@prisma/client"
import { getServerSession } from "next-auth"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getSong } from "@/utilities/spotifyAPI"

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

  const albumPromise = await prisma.album.upsert({
    where: {
      uri: song.album.uri,
    },
    update: {},
    create: {
      name: song.album.name,
      href: song.album.href,
      uri: song.album.uri,
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
          id: albumPromise.id,
        },
      },
      artists: {
        connect: artists.map((artist) => ({ id: artist.id })),
      },
    },
  })

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
}

export async function acceptSuggestedSong(
  suggestedId: string,
  queueId: string,
  songId: string,
) {
  const queue = await prisma.queue.update({
    where: {
      id: queueId,
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
      id: suggestedId,
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
