import { topTracksURL, currentlyPlayingURL } from '@/constants/spotify';

export async function getTopTracks(access_token: string) {
  const res = await fetch(topTracksURL, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });

  return res.json();
}

export async function getCurrentlyPlaying(access_token: string) {
  const res = await fetch(currentlyPlayingURL, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });

  return res.json();
}