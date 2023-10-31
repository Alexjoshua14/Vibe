"use client"

import { FC, useState } from "react"
import { BiSolidSend } from "react-icons/bi"
import { BsChevronLeft, BsChevronRight } from "react-icons/bs"
import { motion } from "framer-motion"

import { useSearch } from "@/app/hooks/useSearch"
import { SpotifyItem } from "@/lib/validators/spotify"
import { addToQueue, addToQueueClient } from "@/utilities/spotifyAPI"

import { SearchField } from "./searchField"
import { AddToQueueModal, SearchResult } from "./songCard"

interface searchProps {}

const Search: FC<searchProps> = ({}) => {
  /* Search Spotify for Tracks */
  const {
    searchResults,
    clearSearchResults,
    searchQuery,
    setSearchQuery,
    searchFieldDisabled,
    handleSearch,
    incrementOffset,
    decrementOffset,
    offset,
    limit,
  } = useSearch()

  /* Add to Queue */
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedSong, setSelectedSong] = useState<SpotifyItem | null>(null)

  /**
   * Enable search on 'enter' key press
   *
   * @param e The key press event
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      handleSearch()
    }
  }

  /**
   * Adds selected item to the queue
   *
   * @param item The item to add to the queue
   */
  const addToQueue = async () => {
    try {
      if (!selectedSong) throw new Error("No song selected")
      const result = await addToQueueClient(selectedSong.uri)
      if (result) {
        handleModalClose("success")
      }
    } catch (error) {
      console.log(error)
      handleModalClose("error", error as string)
    }
  }

  /**
   * Open modal to prompt user to confirm adding item to queue
   *
   * @param item The item to display in the modal
   */
  const handleModalOpen = (item: SpotifyItem) => {
    setSelectedSong(item)
    setModalOpen(true)
  }

  /**
   * Close modal
   */
  const handleModalClose = (
    status: "success" | "error",
    statusCode?: string,
  ) => {
    if (status == "success") clearSearchResults()
    setModalOpen(false)
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex justify-center items-center p-4 gap-2">
        <SearchField
          id="search-music"
          label="Add to Queue.."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={searchFieldDisabled}
        />
        <motion.button
          onClick={handleSearch}
          whileHover={{ scale: 1.07, transition: { duration: 0.4 } }}
        >
          <BiSolidSend size={24} />
        </motion.button>
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
                whileInView={{
                  opacity: 1,
                  transition: { duration: 0.4, delay: index * 0.2 },
                }}
                aria-label={`Add ${item.name} by ${item.artists[0].name} to queue`}
                className={`rounded glassmorphism-white-secondary glassmorphism-0-interactive overflow-hidden cursor-pointer`}
              >
                <SearchResult item={item} />
              </motion.button>
            ))}
          </div>
          <div className="flex justify-end p-2 gap-2">
            <button
              onClick={decrementOffset}
              disabled={offset == 0}
              className="disabled:text-gray-400"
            >
              <BsChevronLeft size={24} />
            </button>
            <button
              onClick={incrementOffset}
              disabled={offset + limit >= searchResults.length}
              className="disabled:text-gray-400"
            >
              <BsChevronRight size={24} />
            </button>
          </div>

          {selectedSong && (
            <AddToQueueModal
              item={selectedSong}
              open={modalOpen}
              addToQueue={addToQueue}
              cancelAddToQueue={() => handleModalClose("error", "cancelled")}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default Search
