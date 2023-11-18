import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
  getCurrentlyPlaying_Host,
  getCurrentlyPlaying_Member,
} from "@/lib/queue-session/currentlyPlaying"
import { Context } from "@/lib/validators/context"
import { setCurrentlyPlaying } from "@/redux/reducers/currentlyPlaying"
import { setStatus } from "@/redux/reducers/status"
import { progressToPercentage } from "@/utilities/helper"

export const useCurrentlyPlaying = () => {
  // const [currentlyPlaying, setCurrentlyPlaying] = useState<Awaited<ReturnType<typeof getCurrentlyPlayingDB>> | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<{
    time: number
    percentage: number
  }>({ time: 0, percentage: 0 })
  const [song_completed, setSongCompleted] = useState<boolean>(false)
  const [imageURL, setImage] = useState("")

  const dispatch = useDispatch()
  const currentlyPlaying = useSelector(
    (state: Context) => state.currentlyPlaying,
  )
  const status = useSelector((state: Context) => state.status)

  const DataIntervalId = useRef<NodeJS.Timer | null>(null)
  const ProgressIntervalId = useRef<NodeJS.Timer | null>(null)

  /**
   * Gets the currently playing song and sets the currently playing state
   * Currently playing is updated every 10 seconds
   *
   * Clears the interval on component unmount
   */
  useEffect(() => {
    const fetchData = async () => {
      if (status === "IDLE" || status === "LOADING") return

      // Ensure Members have a currently playing id, if not then reconnect them
      if (
        (status === "MEMBER" && currentlyPlaying?.id === undefined) ||
        currentlyPlaying?.id === null
      ) {
        console.warn(
          "Currently playing id is undefined or null, reconnecting..",
        )
        dispatch(setStatus("LOADING"))
        return
      }

      // Perform data fetching,
      // if HOST then fetch from Spotify and update database
      // if MEMBER then just fetch from database
      let data =
        status === "HOST"
          ? await getCurrentlyPlaying_Host()
          : await getCurrentlyPlaying_Member(currentlyPlaying.id)
      
      dispatch(setCurrentlyPlaying(data?.payload ?? null))
      setImage(data?.imageURL ?? "")
    }

    if (DataIntervalId.current != null) {
      clearInterval(DataIntervalId.current)
      DataIntervalId.current = null
    }

    if (status === "HOST" || status === "MEMBER") {
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
      // Ensure a song is actually playing based on currentlyPlaying object status
      if (currentlyPlaying) {
        // Set progress_ms to the current progress 
        // with the time since the last update factored in
        let progress_ms =
          currentlyPlaying.progress_ms +
          (currentlyPlaying.updatedAt !== undefined
            ? Date.now() - new Date(currentlyPlaying.updatedAt).getTime()
            : 0)

        // Ensure the progress_ms is not greater than the song duration
        if (
          currentlyPlaying.song &&
          progress_ms > currentlyPlaying.song.duration_ms
        ) {
          progress_ms = currentlyPlaying.song.duration_ms
        }

        // Compute the percentage of the song that has been played
        // defaulting to 0 in any erroneous cases
        const progressPercentage = currentlyPlaying.song
          ? progressToPercentage(progress_ms, currentlyPlaying.song.duration_ms)
          : 0
        setProgress({ time: progress_ms, percentage: progressPercentage })
      }
    }

    if ((status === "HOST" || status === "MEMBER") && !song_completed)
      ProgressIntervalId.current = setInterval(updateProgress, 1000)

    return () => {
      if (ProgressIntervalId.current) {
        clearInterval(ProgressIntervalId.current)
        ProgressIntervalId.current = null
      }
    }
  }, [currentlyPlaying, song_completed, status])

  // Set loading to true if any of the required data is missing
  useEffect(() => {
    if (currentlyPlaying && progress && imageURL) {
      setLoading(false)
    } else {
      setLoading(true)
    }
  }, [currentlyPlaying, imageURL, progress])

  return { currentlyPlaying, progress, imageURL, loading }
}
