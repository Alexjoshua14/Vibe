
import { useEffect, useRef } from 'react'

import { getUserQueued } from '@/lib/prisma/queue'

import 'client-only'


export const useQueue = () => {
    const queued = useRef<
    {
      name: string
      artists: string
      id: string
      image: { url: string; alt: string }
    }[]
  >([])

    const queuedTimerId = useRef<NodeJS.Timeout | null>(null)

      const setQueue = (update: typeof queued.current) => {
    // TODO: Optimize this
    const different =
      update.length === queued.current.length &&
      update
        .map((song) => song.id)
        .every((id) => queued.current.map((song) => song.id).includes(id))

    if (different) return

    queued.current = update
  }


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

      if (queueContent) setQueue(queueContent)
      else setQueue([])
    }

    getQueue()

    queuedTimerId.current = setInterval(() => {
      getQueue()
    }, 10000)
  }, [])

  return { queued, setQueue }
}