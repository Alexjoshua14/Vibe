import React, { useEffect, useState } from "react"
import { CurrentlyPlaying as DBCurrentlyPlaying, Song } from "@prisma/client"

import { getCurrentlyPlayingDB,updateCurrentlyPlayingDB } from "@/lib/prisma/currentlyPlaying"
import { getSongImage } from "@/lib/prisma/song"
import { CurrentlyPlaying } from "@/lib/validators/spotify"
import { progressToPercentage } from "@/utilities/helper"
import { getClientCurrentlyPlaying } from "@/utilities/spotifyAPI"

export const useCurrentlyPlaying = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<
    DBCurrentlyPlaying & { song: Song | null } | null | undefined
  >(undefined)
  const [progress, setProgress] = useState<{
    time: number
    percentage: number
  }>({ time: 0, percentage: 0 })
  const [song_completed, setSongCompleted] = useState<boolean>(false)
  const [imageURL, setImage] = useState("")

  /**
   * Gets the currently playing song and sets the currently playing state
   * Currently playing is updated every 10 seconds
   *
   * Clears the interval on component unmount
   */
  useEffect(() => {
    const fetchData = async () => {
      let dbcp = await getCurrentlyPlayingDB(true, true, true)

      if (dbcp == null) {
        console.log("Database doesn't seem to have a currently playing object..")
        return
      }

      const cp: CurrentlyPlaying | null = await getClientCurrentlyPlaying()

      if (cp) {
        dbcp = await updateCurrentlyPlayingDB(cp, true, true, true)
        setCurrentlyPlaying(dbcp)
        setSongCompleted(false)
      } else {
        console.log("No song playing")
      }
    }

    fetchData()

    // Fetch currently playing song every 15 seconds
    const intervalID = setInterval(fetchData, 10000)

    return () => {
      clearInterval(intervalID)
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
        let progress_ms = currentlyPlaying.progress_ms + (Date.now() - currentlyPlaying.updatedAt.getTime())
        if (currentlyPlaying.song && progress_ms > currentlyPlaying.song.duration_ms) {
          progress_ms = currentlyPlaying.song.duration_ms
          setSongCompleted(true)
        }
        const progressPercentage = currentlyPlaying.song ? 
          progressToPercentage(
            progress_ms,
            currentlyPlaying.song.duration_ms
          ) 
          : 0
        setProgress({ time: progress_ms, percentage: progressPercentage })
      }
    }, 1000)

    return () => {
      clearInterval(progressInterval)
    }
  }, [currentlyPlaying, song_completed])

  useEffect(() => {
    const fetchNewImage = async () => {
      let url = currentlyPlaying?.song?.albumId ?
        await getSongImage(currentlyPlaying.song.albumId).then((img) => img ? img.url : "")
        : ""
      
      setImage(url)
    }
    fetchNewImage()
  }, [currentlyPlaying?.song?.albumId])

  return { currentlyPlaying, progress, imageURL }
}
