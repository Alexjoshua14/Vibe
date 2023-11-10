/**
 * Spotify API scope
 */
export const spotifyScope = [
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-library-read",
  "user-top-read",
]

/**
 * Spotify API base URL
 */
export const spotifyAPI = "https://api.spotify.com/v1/"

/**
 * Spotify API URLs
 */
export const tokenURL = "https://accounts.spotify.com/api/token"
export const topTracksURL = `${spotifyAPI}me/top/tracks`
export const topArtistsURL = `${spotifyAPI}me/top/artists`
export const playbackStateURL = `${spotifyAPI}me/player`
export const recentlyPlayedURL = `${spotifyAPI}me/player/recently-played`
export const currentlyPlayingURL = `${spotifyAPI}me/player/currently-playing`
export const pauseURL = `${spotifyAPI}me/player/pause`
export const playURL = `${spotifyAPI}me/player/play`
export const nextURL = `${spotifyAPI}me/player/next`
export const previousURL = `${spotifyAPI}me/player/previous`
export const shuffleURL = `${spotifyAPI}me/player/shuffle`
export const repeatURL = `${spotifyAPI}me/player/repeat`
export const addToQueueURL = `${spotifyAPI}me/player/queue?uri=`
export const searchURL = `${spotifyAPI}search?q=`
export const getTrackURL = `${spotifyAPI}/tracks`