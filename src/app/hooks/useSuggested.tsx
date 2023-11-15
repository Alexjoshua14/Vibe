import { useCallback, useEffect, useRef, useState } from "react"

import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { acceptSuggestedSong, getUserSuggested, rejectSuggestedSong } from "@/lib/prisma/suggested"

import { useQueue } from "./useQueue"

export const useSuggested = () => {
  const [suggested, setSuggested] = useState<
    {
      name: string
      artists: string
      id: string
      image: { url: string; alt: string }
    }[]
  >([])


  const suggestedTimerId = useRef<NodeJS.Timeout | null>(null)
  const rejectedTimerId = useRef<NodeJS.Timeout | null>(null)

  const { queued, setQueue } = useQueue()

  useEffect(() => {
    if (suggestedTimerId.current)
      clearInterval(suggestedTimerId.current)

    const getSuggested = async () => {
      console.log("Getting suggested")
      let res = await getUserSuggested()
      let suggestedContent =
        res?.songs.map((song) => ({
          name: song.name,
          artists: song.artists.map((artist) => artist.name).join(", "),
          id: song.id,
          image: {
            url: song.album.images[0].url,
            alt: `${song.album.name} cover art`,
          },
        })) ?? null
      setSuggested(suggestedContent ?? [])
    }

    getSuggested()

    suggestedTimerId.current = setInterval(() => {
      console.log("Setting timer for suggested")
      getSuggested()
    }, 10000)

    return () => {
      if (suggestedTimerId.current) clearInterval(suggestedTimerId.current)
    }
  }, [])


  const { toast } = useToast()

  const handleApprove = useCallback(
    (id: string, name: string) => {
      try {
        acceptSuggestedSong(id) ?? { queue: null, suggested: null }

        // Optimistic update
        const updatedQueue = [
          ...queued,
          suggested.find((song) => song.id === id)!,
        ]
        const updatedSuggested = suggested.filter(
          (song) => song.id !== id,
        )
        setQueue(updatedQueue)
        setSuggested(updatedSuggested)
        // setQueue((prev) => [...prev, suggested.find((song) => song.id === id)!])
        // setSuggested((prev) => prev.filter((song) => song.id !== id))

        console.log("APPROVED: " + id)
        toast({
          title: "Added to queue",
          description: `${name} has been added to the queue`,
        })
      } catch (error) { }
    },
    [toast, suggested, queued, setQueue],
  )

  const handleReject = useCallback(
    (id: string, name: string) => {
      rejectedTimerId.current = setTimeout(() => {
        rejectSuggestedSong(id)
      }, 4000)

      // Optimistic update
      const updatedSuggested = suggested.filter(
        (song) => song.id !== id,
      )

      setSuggested(updatedSuggested)

      const undo = () => {
        if (rejectedTimerId.current) clearTimeout(rejectedTimerId.current)
      }

      toast({
        title: "Removed from suggested",
        description: `${name} has been rejected`,
        action: (
          <ToastAction altText={`Remove ${name} from queue`} onClick={undo}>
            Undo
          </ToastAction>
        ),
      })
    },
    [toast, suggested],
  )


  return { suggested, queued, handleApprove, handleReject }
}