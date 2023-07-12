
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/route';

import { LoginButton, LogoutButton } from "@/components/buttons";
import { SongCard } from "@/components/songCard";

import { getTopTracks } from "@/utilities/spotifyAPI";
import { mapToSongs } from "@/utilities/helper";

import { songs } from "@/data/songs";
import { SpotifyItem } from "@/types/spotifyTypes";

export default async function Home() {
  const session = await getServerSession(authOptions);

  let topTracks: SpotifyItem[] = [];
  let currentlyPlaying = null;

  if (!session) {
    console.log("No session found.")
    redirect('/api/auth/signin?callbackUrl=/');
  }

  if (session.accessToken) {
    try {
      const topTracksData = await getTopTracks(session.accessToken);
      topTracks = mapToSongs(topTracksData);
    } catch (error) {
      console.log(error);
    }
  } else {
    throw new Error("No access token found.");
  }

  return (
    <main className="flex-1 p-16 flex flex-col items-center justify-between border-2 border-orange-500">
      <div className="flex flex-col">
        <div className="p-4 border-2 border-yellow-500">
          {session ? <LogoutButton /> : <LoginButton />}
        </div>
        <div className="flex gap-4">
          <SongCard song={topTracks[0] ? topTracks[0] : songs[4]} />
        </div>
      </div>
    </main>
  )
}
