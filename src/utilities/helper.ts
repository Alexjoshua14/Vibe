import { SpotifyItemWrapper, SpotifyItem, SpotifyItemBrief, CurrentlyPlaying, CurrentlyPlayingResponse } from '@/types/spotifyTypes';

/**
 * Extract SpotifyItems from json response
 * 
 * @param json SpotifyItemWrapper
 * @returns array of SpotifyItems
 */
export function mapToSongs(json: SpotifyItemWrapper) {
  return json.items.map((item: SpotifyItem) => {
    return {
      id: item.id,
      name: item.name,
      artists: item.artists,
      album: item.album,
      duration_ms: item.duration_ms,
      href: item.href,
      uri: item.uri,
      type: item.type,
      popularity: item.popularity,
      explicit: item.explicit,
    }
  })
}

/**
 * Extract core information from SpotifyItem
 * 
 * @param song SpotifyItem
 * @returns SpotifyItemBrief
 */
export function songDataToSongBrief(song: SpotifyItem): SpotifyItemBrief {
  return {
    id: song.id,
    name: song.name,
    artists: song.artists.map(artist => artist.name),
    album: song.album.name,
    duration_ms: song.duration_ms,
    href: song.href,
    release_date: song.album.release_date,
    image: song.album.images[0],
  }
}

/**
 * Extract CurrentlyPlaying data from CurrentlyPlayingResponse
 * 
 * @param json CurrentlyPlayingResponse
 * @returns CurrentlyPlaying
 */
export function mapToCurrentlyPlaying(json: CurrentlyPlayingResponse): CurrentlyPlaying {
  return {
    timestamp: json.timestamp,
    progress_ms: json.progress_ms,
    item: json.item,
    currently_playing_type: json.currently_playing_type,
    is_playing: json.is_playing,
  }
}

export function logTopTracks(topTracks: SpotifyItem[]) {
  for (const track of topTracks) {
    console.log(track);
    console.log(track.album.images[0]);
  }
}

/**
 * Convert ms to formatted timestamp
 * 
 * @param duration in milliseconds
 * @returns timestamp in format mm:ss
 */
export function msToTime(duration: number): string {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const formatedTimestamp = [
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');

  return formatedTimestamp;
}

/**
 * Convert expiration time length to timestamp
 * 
 * @param time in seconds
 * @returns timestamp in seconds
*/
export const tokenExpirationFromNow = (time: number) => {
  return Math.floor(Date.now() / 1000 + time);
}

/**
 * Check if token is expired
 * 
 * @param expires_at seconds since epoch
 * @returns boolean indicating whether token is expired
 */
export const tokenExpired = (expires_at?: number): boolean => {
  return (expires_at ?? 0) < Date.now() / 1000;
}

/**
 * Determine realtime playback progress based on latest data fetch
 * 
 * @param ts timestamp of latest progress check
 * @param progress progress in ms
 */
export function playbackTime(ts: number, progress: number) {
  return Math.floor(Date.now() - ts + progress);
}

/**
 * Convert playtime to progress bar percentage [0, 100]
 * 
 * @param time in ms
 * @param duration in ms
 * @returns percentage [0, 100]
 */
export function progressToPercentage(time: number, duration: number): number {
  return Math.floor((time / duration) * 100);
}