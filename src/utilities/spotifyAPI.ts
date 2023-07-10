import { topTracksURL, currentlyPlayingURL } from '@/constants/spotify';

import { SpotifyTopTracksResponse } from '@/types/spotifyTypes';

export async function getTopTracks(access_token: string): Promise<SpotifyTopTracksResponse> {
  const res = await fetch(topTracksURL, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch top tracks..\n" + res.statusText);
  }
  return res.json();
  
}

export async function getCurrentlyPlaying(access_token: string) {
  const res = await fetch(currentlyPlayingURL, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to currently playing..\n" + res.statusText);
  }

  return res.json();
}