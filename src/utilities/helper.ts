import { SpotifyItemWrapper, SpotifyItem, CurrentlyPlaying, CurrentlyPlayingResponse } from '@/types/spotifyTypes';

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

export function songDataToSongBrief(song: SpotifyItem) {
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

export function mapToCurrentlyPlaying(json: CurrentlyPlayingResponse) {
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

export function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const formatedTimestamp = [
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');

  return formatedTimestamp;
}