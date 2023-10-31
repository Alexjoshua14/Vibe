import { SpotifyTopTracksResponse } from "@/lib/validators/spotify"

import { songs } from "./songs"

/** Sample Responses from Spotify API for testing purposes */

export const topTracks: SpotifyTopTracksResponse = {
  href: "https://api.spotify.com/v1/me/shows?offset=0&limit=20",
  limit: 20,
  next: "https://api.spotify.com/v1/me/shows?offset=1&limit=1",
  offset: 0,
  previous: "https://api.spotify.com/v1/me/shows?offset=1&limit=1",
  total: 4,
  items: songs,
}
