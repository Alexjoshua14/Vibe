
import 'client-only'
import React, {useEffect, useState} from 'react'
import { SpotifyItem } from '@/types/spotifyTypes';
import { searchSpotify } from '@/utilities/spotifyAPI';

export const useSearch = () => {

  /* Search */
  const [searchResults, setSearchResults] = useState<SpotifyItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFieldDisabled, setSearchFieldDisabled] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const limit = 5;

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

  const clearSearchResults = () => {
    setSearchResults([]);
  }


  return { searchResults, clearSearchResults, searchQuery, setSearchQuery, searchFieldDisabled, offset, limit, incrementOffset, decrementOffset, handleSearch }
  
}