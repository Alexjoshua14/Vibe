'use client'

import { useEffect, useState } from "react";

import { SearchField } from "@/components/searchField";

import { getClientCurrentlyPlaying } from "@/utilities/spotifyAPI";
import { msToTime } from "@/utilities/helper";

import { 
  SpotifyItem, 
  CurrentlyPlaying, 
} from "@/types/spotifyTypes";

import { SongCard } from "@/components/songCard";
import { songs } from "@/data/songs";

export default function Player() {
  
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      const currentlyPlaying = await getClientCurrentlyPlaying();
      if (currentlyPlaying) {
        setCurrentlyPlaying(currentlyPlaying);
        setProgress(Math.floor((currentlyPlaying.progress_ms / currentlyPlaying.item.duration_ms) * 100));
      } else {
        console.log("No song playing")
      }
    }, 10000);
    if (currentlyPlaying) {
      console.log("Currently Playing: " + currentlyPlaying.progress_ms);
      console.log("Duration Playing: " + currentlyPlaying.item.duration_ms);
      console.log("Progress Playing: " + progress);
    }
    // Clear timer on component unmount
    return () => {
      clearInterval(interval);
    }
  }, );

  return (
    <main className="flex-1 p-16 flex flex-col items-center justify-between border-2 border-orange-500">
      <div className="flex flex-col">
        <div className="flex gap-4">
          {currentlyPlaying ? 
            <SongCard 
              song={currentlyPlaying ? currentlyPlaying.item : songs[4]} 
              progress={progress} 
            /> :
            <div>
              <h1>
                Start listening to something
              </h1>
            </div>
          }
          <div>{msToTime(currentlyPlaying ? currentlyPlaying.progress_ms : 0)}</div>
        </div>
        <div className="flex justify-center items-center p-4">
          <SearchField id="search-music" label="Add to Queue" variant="outlined" />
        </div>
      </div>
    </main>
  )
}
