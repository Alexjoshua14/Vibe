'use server'

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { topTracksURL, currentlyPlayingURL } from '@/constants/spotify';
import { mapToCurrentlyPlaying } from '@/utilities/helper';

import { SpotifyTopTracksResponse, CurrentlyPlayingResponse } from '@/types/spotifyTypes';

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

export async function getCurrentlyPlaying(access_token: string): Promise<CurrentlyPlayingResponse> {
  const res = await fetch(currentlyPlayingURL, {
    headers: {
      Authorization: `Bearer ${access_token}`
    },
    next: {
      revalidate: 5
    }
  },);

  if (!res.ok) {
    throw new Error("Failed to currently playing..\n" + res.statusText);
  }

  return res.json();
}

export async function getClientCurrentlyPlaying() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("No session found");
  }

  if (session.accessToken) {
    const currentlyPlayingData = await getCurrentlyPlaying(session.accessToken);

    return mapToCurrentlyPlaying(currentlyPlayingData);
  }
  
}