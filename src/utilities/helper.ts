import { 
  SpotifyItemWrapper, 
  SpotifyItem, 
  SpotifyItemBrief, 
  CurrentlyPlaying, 
  CurrentlyPlayingResponse, 
  CurrentlyPlayingSchema,
  SpotifyItemSchema
} from '@/lib/validators/spotify';

/**
 * Extract SpotifyItems from json response
 * 
 * @param json SpotifyItemWrapper
 * @returns array of SpotifyItems
 */
export function mapToSongs(json: SpotifyItemWrapper) {
  return json.items.map((item: SpotifyItem) => {
    return SpotifyItemSchema.parse(item);
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
  return CurrentlyPlayingSchema.parse(json);
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
  if (time == null || duration == null || duration == 0)
    return 0;

  let percentage = (time / duration);

  if (percentage < 0 || percentage > 1)
    percentage = time < duration ? 0 : 1;

  return Math.floor(percentage * 100);
}