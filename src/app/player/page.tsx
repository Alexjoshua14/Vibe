
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import { getCurrentlyPlaying } from "@/utilities/spotifyAPI";
import { 
  mapToCurrentlyPlaying, 
  mapToSongs 
} from "@/utilities/helper";

import { 
  SpotifyItem, 
  CurrentlyPlaying, 
  CurrentlyPlayingResponse 
} from "@/types/spotifyTypes";

import { SongCard } from "@/components/songCard";
import { songs } from "@/data/songs";

export default async function Player() {
  const session = await getServerSession(authOptions);
  
  let currentlyPlaying: CurrentlyPlaying | null = null;

  if (!session) {
    console.log("No session found.")
    redirect('/api/auth/signin?callbackUrl=/Player');
  }

  if (session.accessToken) {
    try {
    const currentlyPlayingData = await getCurrentlyPlaying(session.accessToken);
    // const topTracksResponse = await Promise.all([topTracksData]);
    // console.log(topTracks);
    console.log(currentlyPlayingData);
    currentlyPlaying = mapToCurrentlyPlaying(currentlyPlayingData);
    
    // console.log("_____________________________________");
    // logTopTracks(topTracks);
  } catch (error) {
    console.log(error);
  }
  } else {
    throw new Error("No access token found.");
  }

  return (
    <main className="flex-1 p-16 flex flex-col items-center justify-between border-2 border-orange-500">
      <div className="flex flex-col">
        <div className="flex gap-4">
          <SongCard song={currentlyPlaying ? currentlyPlaying.item : songs[4]} />
        </div>
      </div>
    </main>
  )
}
