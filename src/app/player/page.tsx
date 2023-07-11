'use client'

import { useEffect, useState } from "react";

import { SearchField } from "@/components/searchField";

import { getClientCurrentlyPlaying, searchSpotify, addToQueueClient } from "@/utilities/spotifyAPI";
import { msToTime } from "@/utilities/helper";

import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { BiSolidSend } from "react-icons/bi";

import { 
  SpotifyItem, 
  CurrentlyPlaying, 
} from "@/types/spotifyTypes";

import { SongCard, SearchResult } from "@/components/songCard";
import { songs } from "@/data/songs";

export default function Player() {
  
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [filters, setFilters] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SpotifyItem[]>(songs);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const incrementOffset = () => {
    if (offset + limit <= searchResults.length) {
      setOffset(offset + limit);
    } 
  }

  const decrementOffset = () => {
    if (offset - limit < 0) {
      setOffset(0);
    } else {
      setOffset(offset - limit);
    }
  }

  const handleSearch = async () => {
    const results = await searchSpotify(searchQuery);
    setSearchQuery("");
    setSearchResults(results);
  }

  const addToQueue = async (item: SpotifyItem) => {
    console.log(item);
    const result = await addToQueueClient(item.uri);
  }

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
        <div className="flex justify-center items-center p-4 gap-2">
          <SearchField 
            id="search-music" 
            label="Add to Queue" 
            variant="outlined" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>
            <BiSolidSend size={24} />
          </button>
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-2">
          {searchResults.length > 0 &&
            searchResults.slice(offset, offset + limit).map((item, index) => (
              <button key={index} onClick={() => addToQueue(item)}>
                <SearchResult item={item} />
              </button>
            )) 
          }
        </div>
        <div className="flex">
          <button onClick={decrementOffset} disabled={offset == 0} className="disabled:text-gray-400">
            <BsChevronLeft />
          </button>
          <button onClick={incrementOffset} disabled={offset + limit >= searchResults.length} className="disabled:text-gray-400">
            <BsChevronRight />
          </button>
        </div>
      </div>
    </main>
  )
}
