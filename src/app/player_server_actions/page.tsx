'use client'

import { useEffect, useState } from "react";

import { getClientCurrentlyPlaying } from "@/utilities/spotifyAPI";

import { 
  SpotifyItem, 
  CurrentlyPlaying, 
} from "@/types/spotifyTypes";

import { SongCard } from "@/components/songCard";
import { songs } from "@/data/songs";

export default function Player() {
  
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const currentlyPlaying = await getClientCurrentlyPlaying();
      if (currentlyPlaying) 
        setCurrentlyPlaying(currentlyPlaying);
    }, 5000);

    // Clear timeer on component unmount
    return () => clearInterval(interval);
  }, []);

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
