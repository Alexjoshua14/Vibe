'use server'

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { topTracksURL, currentlyPlayingURL, searchURL, addToQueueURL } from '@/constants/spotify';
import { mapToCurrentlyPlaying, mapToSongs } from '@/utilities/helper';

import { SpotifyTopTracksResponse, CurrentlyPlayingResponse, SpotifySearchResponse } from '@/types/spotifyTypes';

/*
* Get the user's top tracks
*/
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

/*
* Get the user's currently playing track
*/
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

/*
* Accept client side request to fetch currently playing track
*/
export async function getClientCurrentlyPlaying() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("No session found");
  }

  if (session.accessToken) {
    const currentlyPlayingData = await getCurrentlyPlaying(session.accessToken);
    if (currentlyPlayingData)
      return mapToCurrentlyPlaying(currentlyPlayingData);
    return currentlyPlayingData;
  } else {
    throw new Error("No access token found");
  }
}

/*
* Search Spotify for a track
*/
export async function search(access_token: string, query: string): Promise<SpotifySearchResponse> {
  const queryURI = encodeURIComponent(query);
  const res = await fetch(`${searchURL}${queryURI}&type=track`, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to search..\n" + res.statusText);
  }

  return res.json();
}

/*
* Accept client side request to search Spotify for a track
*/
export async function searchSpotify(query: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("No session found");
  }

  if (session.accessToken) {
    const searchResults = await search(session.accessToken, query);
    if (searchResults)
      return mapToSongs(searchResults.tracks);
    return searchResults;
  } else {
    throw new Error("No access token found");
  }
}

/*
* Add track to queue
*/
export async function addToQueue(access_token: string, uri: string) {
  const queryURI = encodeURIComponent(uri);
  const res = await fetch(`${addToQueueURL}${queryURI}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });

  return res.ok;
}

/*
* Accept client side request to add track to queue
*/
export async function addToQueueClient(uri: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("No session found");
  }

  if (session.accessToken) {
    const resStatus = await addToQueue(session.accessToken, uri);
    return resStatus;
  } else {
    throw new Error("No access token found");
  }
}