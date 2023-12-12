import { useEffect, useRef, useState } from "react"

import { getUserQueued } from "@/lib/prisma/queue"

import "client-only"

/**
 * useQueue hook for fetching songs in database queue
 * Polls data every 10 seconds
 */
export const useQueue = () => {
  const [queued, setQueue] = useState<
    {
      name: string
      artists: string
      id: string
      image: { url: string; alt: string }
    }[]
  >([])

  const queuedTimerId = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const getQueue = async () => {
      let res = await getUserQueued()
      let queueContent =
        res?.songs.map((song) => ({
          name: song.name,
          artists: song.artists.map((artist) => artist.name).join(", "),
          id: song.id,
          image: {
            url: song.album.images[0].url,
            alt: `${song.album.name} cover art`,
          },
        })) ?? null

      setQueue(queueContent ?? [])
    }

    getQueue()

    queuedTimerId.current = setInterval(() => {
      getQueue()
    }, 10000)
  }, [])

  return { queued, setQueue }
}
