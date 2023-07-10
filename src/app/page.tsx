
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/route';
import { LoginButton, LogoutButton } from "@/components/buttons";

import { getTopTracks } from "@/utilities/spotifyAPI";

import { SongCard } from "@/components/songCard";
import { songs } from "@/data/songs";

const currentlyPlayingURL = "https://api.spotify.com/v1/me/player/currently-playing";
const topTracksURL = "https://api.spotify.com/v1/me/top/tracks";



function logTopTracks(topTracks: any[]) {
  for (const track of topTracks) {
    console.log(track);
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("No session found.")
    redirect('/api/auth/signin?callbackUrl=/');
  }

  let currentlyPlaying = null;

  console.log("Logging session:");
  console.log(session);

  if (session.accessToken) {
    const topTracksData = await getTopTracks(session.accessToken);
    const topTracks = await Promise.all([topTracksData]);
    // console.log(topTracks);
    // logTopTracks(topTracks);
  } else {
    throw new Error("No access token found.");
  }

  return (
    <main className="flex-1 p-16 flex flex-col items-center justify-between border-2 border-orange-500">
      <div className="flex flex-col">
        <div className="p-4 border-2 border-yellow-500">
          {session ? <LogoutButton /> : <LoginButton />}
        </div>
        <div>
          <SongCard song={currentlyPlaying ? songs[5] : songs[6]} />
        </div>
      </div>
    </main>
  )
}
