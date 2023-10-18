
import React, { useEffect, useState } from 'react'
import { CurrentlyPlaying } from '@/lib/validators/spotify';
import { getClientCurrentlyPlaying } from "@/utilities/spotifyAPI";
import { progressToPercentage } from '@/utilities/helper';

export const useCurrentlyPlaying = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying | null>(null);
  const [progress, setProgress] = useState<{ time: number, percentage: number }>({ time: 0, percentage: 0 });
  const [song_completed, setSongCompleted] = useState<boolean>(false);

  /**
   * Gets the currently playing song and sets the currently playing state
   * Currently playing is updated every 10 seconds
   * 
   * Clears the interval on component unmount
   */
  useEffect(() => {
    const fetchData = async () => {
      const cp: CurrentlyPlaying | null = await getClientCurrentlyPlaying();
      console.log(cp)

      if (cp) {
        setCurrentlyPlaying(cp);
        setSongCompleted(false);
      } else {
        console.log("No song playing");
      }
    }

    fetchData()

    // Fetch currently playing song every 15 seconds
    const intervalID = setInterval(fetchData, 10000);

    return () => {
      clearInterval(intervalID);
    }
  }, [song_completed])

  /** 
   * Constantly updates the progress of the currently playing song every second
   * 
   * NOTE: Spotify API's timestamp has had noteable problems for years
   * NOTE: setInterval is not guaranteed to run at the time interval specified, it's only a minimum wait time..
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

  return { currentlyPlaying, progress }
}
