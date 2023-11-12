"use server"

import { getServerSession } from "next-auth/next"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import {
  addToQueueURL,
  currentlyPlayingURL,
  getTrackURL,
  playbackStateURL,
  searchURL,
  topTracksURL,
} from "@/constants/spotify"
import {
  CurrentlyPlaying,
  CurrentlyPlayingResponse,
  PlaybackStateResponse,
  SpotifySearchResponse,
  SpotifyTopTracksResponse,
  SpotifyTopTracksResponseSchema,
  TrackResponse,
  TrackResponseSchema,
} from "@/lib/validators/spotify"
import { mapToCurrentlyPlaying, mapToSongs } from "@/utilities/helper"

/**
 * Get the user's top tracks
 *
 * @param access_token Spotify access_token
 * @returns SpotifyTopTracksResponse
 * @throws Error if response is not ok
 */
export async function getTopTracks(
  access_token: string,
): Promise<SpotifyTopTracksResponse> {
  const res = await fetch(topTracksURL, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch top tracks..\n" + res.statusText)
  }

  try {
    const response = await res.json()

    const topTracks = SpotifyTopTracksResponseSchema.parse(response)
    return topTracks
  } catch (e) {
    console.error(e)
    return Promise.reject(e)
  }
}

/**
 * Fetch currently playing track from Spotify
 *
 * @param access_token Spotify access_token
 * @returns promise containing CurrentlyPlayingResponse
 */
export async function getCurrentlyPlaying(access_token: string) {
  const res = await fetch(currentlyPlayingURL, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: {
      revalidate: 5,
    },
  })

  if (!res.ok) {
    throw new Error("Failed to currently playing..\n" + res.statusText)
  }

  return res.json()
}

/**
 * Accept client side request to fetch currently playing track from Spotify
 *
 * @returns CurrentlyPlaying
 * @throws Error if no session or access token found
 */
export async function getClientCurrentlyPlaying() {
  console.log("Get client CurrentlyPlaying has been called")
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new Error("No session found")
  }

  if (session.accessToken) {
    try {
      const currentlyPlayingData = await getCurrentlyPlaying(
        session.accessToken,
      )
      if (currentlyPlayingData) {
        return mapToCurrentlyPlaying(currentlyPlayingData)
      }
      return currentlyPlayingData
    } catch (error) {
      console.error(error)
      return null
    }
  } else {
    throw new Error("No access token found")
  }
}

/**
 * Search Spotify for a track
 *
 * @param access_token
 * @param query string to search for
 * @returns promise containing SpotifySearchResponse
 */
export async function search(
  access_token: string,
  query: string,
): Promise<SpotifySearchResponse> {
  const queryURI = encodeURIComponent(query)
  const res = await fetch(`${searchURL}${queryURI}&type=track`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Failed to search..\n" + res.statusText)
  }

  return res.json()
}

/**
 * Accept client side request to search Spotify for a track
 *
 * @param query string to search for
 * @returns
 * @throws Error if no session or access token found
 */
export async function searchSpotify(query: string) {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new Error("No session found")
  }

  if (session.accessToken) {
    const searchResults = await search(session.accessToken, query)
    if (searchResults) return mapToSongs(searchResults.tracks)
    return searchResults
  } else {
    throw new Error("No access token found")
  }
}

/**
 * Add track to queue
 *
 * @param access_token
 * @param uri track uri to add to queue
 * @returns boolean indicating success
 */
export async function addToQueue(access_token: string, uri: string) {
  const queryURI = encodeURIComponent(uri)
  const res = await fetch(`${addToQueueURL}${queryURI}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  return res.ok
}

/**
 * Accept client side request to add track to queue
 *
 * @param uri track uri to add to queue
 * @returns boolean indicating success
 * @throws Error if no session or access token found
 */
export async function addToQueueClient(uri: string) {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new Error("No session found")
  }

  if (session.accessToken) {
    const resStatus = await addToQueue(session.accessToken, uri)
    return resStatus
  } else {
    throw new Error("No access token found")
  }
}

export async function getSong(songId: string) {
  const session = await getServerSession(authOptions)

  if (!session) throw new Error("No session found")

  if (!session.accessToken) throw new Error("No access token found")

  const res = await fetch(`${getTrackURL}/${songId}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  })

  console.log(res)

  if (!res.ok) {
    throw new Error("Failed to get song..\n" + res.statusText)
  }

  let songjson = await res.json()
  let song = TrackResponseSchema.parse(songjson)

  return song
}
