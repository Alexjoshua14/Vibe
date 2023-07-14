'use client'

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { SearchField } from "@/components/searchField";
import { SongCard, SearchResult, AddToQueueModal } from "@/components/songCard";

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
  const [song_completed, setSongCompleted] = useState<boolean>(false);
  //const [filters, setFilters] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SpotifyItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFieldDisabled, setSearchFieldDisabled] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedSong, setSelectedSong] = useState<SpotifyItem | null>(null);

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
    const searchField = document.getElementById("search-music") as HTMLInputElement;
    if (searchField) {
      searchField.blur();
      setSearchFieldDisabled(true);
    }
    const results = await searchSpotify(searchQuery);
    setSearchQuery("");
    setSearchFieldDisabled(false);
    setSearchResults(results);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      handleSearch();
    }
  }

  /**
   * Adds selected item to the queue
   * 
   * @param item The item to add to the queue
   */
  const addToQueue = async () => {
    try {
      if (!selectedSong) throw new Error("No song selected");
      const result = await addToQueueClient(selectedSong.uri);
      if (result) {
        setSearchResults([]);
        setModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setModalOpen(false);
    }
  }

  const handleModalOpen = (item: SpotifyItem) => {
    setSelectedSong(item);
    setModalOpen(true);
  }

  const handleModalClose = () => {
    setModalOpen(false);
  }

  /**
   * Gets the currently playing song and sets the currently playing state
   * Currently playing is updated every 10 seconds
   * 
   * Clears the interval on component unmount
   */
  useEffect(() => {
    const fetchData = async () => {
      //Could alter this to check if song has changed
      const currentlyPlaying: CurrentlyPlaying | null = await getClientCurrentlyPlaying();
      if (currentlyPlaying) {
        setCurrentlyPlaying(currentlyPlaying);
        setSongCompleted(false);
      } else {
        console.log("No song playing");
      }
    }

    const interval = setInterval(fetchData, 10000);

    return () => {
      clearInterval(interval);
    }
  }, [song_completed]);

  /*** NOTE: Spotify API's timestamp has had noteable problems for years
    * @see https://community.spotify.com/t5/Spotify-for-Developers/API-playback-timestamp/m-p/5291948#M3571
    * @see https://github.com/spotify/web-api/issues/1073 
    */
  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (currentlyPlaying && song_completed == false) {
        let progress_ms = Date.now() - currentlyPlaying.timestamp;
        if (progress_ms > currentlyPlaying.item.duration_ms) {
          progress_ms = currentlyPlaying.item.duration_ms;
          setSongCompleted(true);
        }
        const progressPercentage = progressToPercentage(progress_ms, currentlyPlaying.item.duration_ms);
        setProgress({ time: progress_ms, percentage: progressPercentage });
      }
    }, 1000);

    return () => {
      clearInterval(progressInterval);
    }
  }, [currentlyPlaying, song_completed]);

  return (
    <main className="flex-1 p-4 flex flex-col items-center justify-around overflow-hidden">
      <div className="flex flex-col">
        <div className="flex gap-4 h-[400px] sm:h-[140px]">
          {currentlyPlaying ?
            <SongCard
              song={currentlyPlaying ? currentlyPlaying.item : songs[4]}
              progress_ms={progress.time}
            /> :
            <div className="flex h-full w-full justify-center items-center text-center">
              <h1>
                Start listening to something..
              </h1>
            </div>
          }
        </div>
        <div className="flex justify-center items-center p-4 gap-2">
          <SearchField
            id="search-music"
            label="Add to Queue"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={searchFieldDisabled}
          />
          <motion.button
            onClick={handleSearch}
            whileHover={{ scale: 1.07, transition: { duration: .4 } }}
          >
            <BiSolidSend size={24} />
          </motion.button>
        </div>
      </div>
      {searchResults.length > 0 && (
        <div>
          <div className="flex flex-col gap-2">
            {searchResults.slice(offset, offset + limit).map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => handleModalOpen(item)}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, transition: { duration: .4, delay: index * 0.2 } }}
              >
                <SearchResult item={item} />
              </motion.button>
            ))
            }
          </div>
          <div className="flex justify-end p-2 gap-2">
            <button onClick={decrementOffset} disabled={offset == 0} className="disabled:text-gray-400">
              <BsChevronLeft size={24} />
            </button>
            <button onClick={incrementOffset} disabled={offset + limit >= searchResults.length} className="disabled:text-gray-400">
              <BsChevronRight size={24} />
            </button>
          </div>

          {selectedSong && <AddToQueueModal item={selectedSong} open={modalOpen} addToQueue={() => addToQueue} cancelAddToQueue={handleModalClose} />}
        </div>
      )}
    </main>
  )
}
