'use client'

import { useEffect, useState } from "react";

import { SearchField } from "@/components/searchField";
import { SongCard, SearchResult } from "@/components/songCard";

import { getClientCurrentlyPlaying, searchSpotify, addToQueueClient } from "@/utilities/spotifyAPI";
import { msToTime, playbackTime, progressToPercentage } from "@/utilities/helper";

import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { BiSolidSend } from "react-icons/bi";

import {
  SpotifyItem,
  CurrentlyPlaying,
} from "@/types/spotifyTypes";

import { songs } from "@/data/songs";

/**
 * The player page
 * 
 * @returns The player page
 */
export default function Player() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying | null>(null);
  const [progress, setProgress] = useState<{ time: number, percentage: number }>({ time: 0, percentage: 0 });
  //const [filters, setFilters] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SpotifyItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  /**
   * Increments the offset by the limit if the offset + limit is less than the length of the search results
   */
  const incrementOffset = () => {
    if (offset + limit <= searchResults.length) {
      setOffset(offset + limit);
    }
  }

  /**
   * Decrements the offset by the limit if the offset - limit is greater than 0
   */
  const decrementOffset = () => {
    if (offset - limit < 0) {
      setOffset(0);
    } else {
      setOffset(offset - limit);
    }
  }

  /**
   * Handles the search query and sets the search results
   */
  const handleSearch = async () => {
    const results = await searchSpotify(searchQuery);
    setSearchQuery("");
    setSearchResults(results);
  }

  /**
   * Adds provided item to the queue
   * 
   * @param item The item to add to the queue
   */
  const addToQueue = async (item: SpotifyItem) => {
    const result = await addToQueueClient(item.uri);
    if (result) {
      setSearchResults([]);
    } else {
      console.log("Failed to add to queue");
    }
  }

  /**
   * Gets the currently playing song and sets the currently playing state
   * Currently playing is updated every 10 seconds
   * 
   * Clears the interval on component unmount
   */
  useEffect(() => {
    const fetchData = async () => {
      const currentlyPlaying: CurrentlyPlaying | null = await getClientCurrentlyPlaying();
      if (currentlyPlaying) {
        setCurrentlyPlaying(currentlyPlaying);
      } else {
        console.log("No song playing");
      }
    }

    const interval = setInterval(fetchData, 10000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  /*** NOTE: Spotify API's timestamp has had noteable problems for years
    * @see https://community.spotify.com/t5/Spotify-for-Developers/API-playback-timestamp/m-p/5291948#M3571
    * @see https://github.com/spotify/web-api/issues/1073 
    */
  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (currentlyPlaying) {
        let progress_ms = Date.now() - currentlyPlaying.timestamp;
        if (progress_ms > currentlyPlaying.item.duration_ms) {
          progress_ms = currentlyPlaying.item.duration_ms;
        }
        const progressPercentage = progressToPercentage(progress_ms, currentlyPlaying.item.duration_ms);
        setProgress({ time: progress_ms, percentage: progressPercentage });
      }
    }, 1000);

    return () => {
      clearInterval(progressInterval);
    }
  }, [currentlyPlaying]);

  return (
    <main className="flex-1 p-16 flex flex-col items-center justify-between border-2 border-orange-500">
      <div className="flex flex-col">
        <div className="flex gap-4">
          {currentlyPlaying ?
            <SongCard
              song={currentlyPlaying ? currentlyPlaying.item : songs[4]}
              progress_ms={progress.time}
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
      {searchResults.length > 0 && (
        <div>
          <div className="flex flex-col gap-2">
            {searchResults.slice(offset, offset + limit).map((item, index) => (
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
      )}
    </main>
  )
}
