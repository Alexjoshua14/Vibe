import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Artist, CurrentlyPlaying as DBCurrentlyPlaying, Song } from "@prisma/client"

import { getCurrentlyPlayingDB,getCurrentlyPlayingDBMember,updateCurrentlyPlayingDB } from "@/lib/prisma/currentlyPlaying"
import { getSongImage } from "@/lib/prisma/song"
import { Context } from "@/lib/validators/context"
import { CurrentlyPlaying } from "@/lib/validators/spotify"
import { setCurrentlyPlaying } from '@/redux/reducers/currentlyPlaying'
import { progressToPercentage } from "@/utilities/helper"
import { getClientCurrentlyPlaying } from "@/utilities/spotifyAPI"


export const useCurrentlyPlaying = () => {
  // const [currentlyPlaying, setCurrentlyPlaying] = useState<Awaited<ReturnType<typeof getCurrentlyPlayingDB>> | null | undefined>(undefined)
  const [progress, setProgress] = useState<{
    time: number
    percentage: number
  }>({ time: 0, percentage: 0 })
  const [song_completed, setSongCompleted] = useState<boolean>(false)
  const [imageURL, setImage] = useState("")

  const dispatch = useDispatch()
  const currentlyPlaying = useSelector((state: Context) => state.currentlyPlaying)
  const status = useSelector((state: Context) => state.status)

  const DataIntervalId = useRef<NodeJS.Timer | null>(null);
  const ProgressIntervalId = useRef<NodeJS.Timer | null>(null);

  /**
   * Gets the currently playing song and sets the currently playing state
   * Currently playing is updated every 10 seconds
   *
   * Clears the interval on component unmount
   */
  useEffect(() => {
    const fetchData = async () => {
      let dbcp = 
        status === 'HOST' 
          ? await getCurrentlyPlayingDB(true, true, true) 
          : status === 'MEMBER' 
            ? await getCurrentlyPlayingDBMember(currentlyPlaying?.id, true, true, true) 
              : null

      if (dbcp == null) {
        console.log("Database doesn't seem to have a currently playing object..")
        return
      }

      let cp: CurrentlyPlaying | null = null
      let payload = null

      if (status === 'HOST')
        cp = await getClientCurrentlyPlaying()

      if (cp) {
        dbcp = await updateCurrentlyPlayingDB(cp, true, true, true)
      } else if (!dbcp) {
        console.log("No song playing")
      }

      if (dbcp) {
        payload = 
          { 
            ...dbcp, 
            timestamp: dbcp.timestamp.toISOString(), 
            updatedAt: dbcp.updatedAt.toISOString(), 
            queue: { ...dbcp.queue, updatedAt: dbcp.queue.updatedAt.toISOString() }, 
            suggested: { ...dbcp?.suggested, updatedAt: dbcp?.suggested.updatedAt.toISOString() } 
          }
      } 

      dispatch(setCurrentlyPlaying(payload))
      // setSongCompleted(false)
    }

    if (DataIntervalId.current != null) {
      clearInterval(DataIntervalId.current)
      DataIntervalId.current = null
    }

    if (status === 'HOST' || status === 'MEMBER') {
      fetchData()
      // Fetch currently playing song every 10 seconds
      DataIntervalId.current = setInterval(fetchData, 10000)
    }

    return () => {
      if (DataIntervalId.current) {
        clearInterval(DataIntervalId.current)
        DataIntervalId.current = null
      }
    }
  }, [dispatch, status, currentlyPlaying?.id])

  /**
   * Constantly updates the progress of the currently playing song every second
   *
   * NOTE: Spotify API's timestamp has had noteable problems for years
   * NOTE: setInterval is not guaranteed to run at the time interval specified, it's only a minimum wait time..
   * @see https://community.spotify.com/t5/Spotify-for-Developers/API-playback-timestamp/m-p/5291948#M3571
   * @see https://github.com/spotify/web-api/issues/1073
   */
  useEffect(() => {
    const updateProgress = () => {
      if (currentlyPlaying && song_completed == false) {
        let progress_ms = currentlyPlaying.progress_ms + (currentlyPlaying.updatedAt !== undefined ? Date.now() - (new Date(currentlyPlaying.updatedAt)).getTime() : 0)
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
    }
    
    if (status !== 'IDLE' && !song_completed)
      ProgressIntervalId.current = setInterval(updateProgress, 1000)

    return () => {
      if (ProgressIntervalId.current) {
        clearInterval(ProgressIntervalId.current)
        ProgressIntervalId.current = null
      }
    }
  }, [currentlyPlaying, song_completed, status])

  useEffect(() => {
    const fetchNewImage = async () => {
      let url = currentlyPlaying?.song?.albumId ?
        await getSongImage(currentlyPlaying.song.albumId).then((img) => img ? img.url : "")
        : ""
      
      setImage(url)
    }

    if (status !== 'IDLE')
      fetchNewImage()
  }, [currentlyPlaying?.song?.albumId, status])

  return { currentlyPlaying, progress, imageURL }
}
