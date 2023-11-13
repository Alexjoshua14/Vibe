"use client"

import { FC, Suspense, use, useCallback, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Album, Artist, Image, Song } from "@prisma/client"
import { set } from "zod"

import { useSessionManagement } from "@/app/hooks/useSessionManagement"
import { postSampleData } from "@/data/songs"
import { getUserQueued } from "@/lib/prisma/queue"
import {
  acceptSuggestedSong,
  getSuggested,
  getUserSuggested,
  rejectSuggestedSong,
} from "@/lib/prisma/suggested"
import { Context } from "@/lib/validators/context"

import Search from "./search/search"
import { ToastAction } from "./ui/toast"
import { useToast } from "./ui/use-toast"
import { CallbackButton } from "./buttons"
import CurrentlyPlaying from "./currentlyPlaying"
import { LeaveSession } from "./sessionButtons"
import SongCarousel from "./songCarousel"

interface sharedSessionProps { }

const SharedSession: FC<sharedSessionProps> = ({ }) => {
  const currentlyPlaying = useSelector(
    (state: Context) => state.currentlyPlaying,
  )
  const status = useSelector((state: Context) => state.status)

  if (status === "HOST") return HostSession()
  else return MemberSession()
}

const HostSession = () => {
  const { handleLeaveQueueSession } = useSessionManagement()
  // const [suggested, setSuggested] = useState<
  //   {
  //     name: string
  //     artists: string
  //     id: string
  //     image: { url: string; alt: string }
  //   }[]
  // >([])
  // const [queued, setQueue] = useState<
  //   {
  //     name: string
  //     artists: string
  //     id: string
  //     image: { url: string; alt: string }
  //   }[]
  // >([])

  const suggested = useRef<
    {
      name: string
      artists: string
      id: string
      image: { url: string; alt: string }
    }[]
  >([])
  const queued = useRef<
    {
      name: string
      artists: string
      id: string
      image: { url: string; alt: string }
    }[]
  >([])

  const rejectedTimerId = useRef<NodeJS.Timeout | null>(null)

  const setSuggested = (update: typeof suggested.current) => {
    // TODO: Optimize this 
    const different =
      update.length === suggested.current.length
      &&
      update.every((song) => suggested.current.includes(song))

    if (different)
      return

    suggested.current = update
  }

  const setQueue = (update: typeof queued.current) => {
    // TODO: Optimize this 
    const different =
      update.length === queued.current.length
      &&
      update.map((song) => song.id).every((id) => queued.current.map((song) => song.id).includes(id))

    if (different)
      return

    queued.current = update
  }

  const suggestedTimerId = useRef<NodeJS.Timeout | null>(null)
  const queuedTimerId = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (suggestedTimerId.current) clearInterval(suggestedTimerId.current)
    const getSuggested = async () => {
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
      if (suggestedContent) setSuggested(suggestedContent)
      else setSuggested([])
    }

    getSuggested()

    suggestedTimerId.current = setInterval(() => {
      getSuggested()
    }, 10000)

    return () => {
      if (suggestedTimerId.current) clearInterval(suggestedTimerId.current)
    }
  }, [])

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

  // const queued = [{ ...tempSong, id: Math.random() }, { ...tempSong, id: Math.random() }, { ...tempSong, id: Math.random() }, { ...tempSong, id: Math.random() }, { ...tempSong, id: Math.random() }]
  // const host = currentlyPlaying?.userId ? getUser(currentlyPlaying.userId).then((user) => user) : null

  const { toast } = useToast()

  const handleApprove = useCallback(
    (id: string, name: string) => {
      try {
        acceptSuggestedSong(id) ?? { queue: null, suggested: null }

        // Optimistic update
        const updatedQueue = [...queued.current, suggested.current.find((song) => song.id === id)!]
        const updatedSuggested = suggested.current.filter((song) => song.id !== id)
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
    }, [toast, suggested])

  const handleReject = useCallback(
    (id: string, name: string) => {
      rejectedTimerId.current = setTimeout(() => {
        rejectSuggestedSong(id)
      }, 4000)

      // Optimistic update
      const updatedSuggested = suggested.current.filter(
        (song) => song.id !== id,
      )

      setSuggested(updatedSuggested)

      const undo = () => {
        if (rejectedTimerId.current)
          clearTimeout(rejectedTimerId.current)
      }

      toast({
        title: "Removed from suggested",
        description: `${name} has been rejected`,
        action: (
          <ToastAction altText={`Remove ${name} from queue`} onClick={undo}>Undo</ToastAction>
        )
      })
    }, [toast])

  return (
    <div className="w-full h-full">
      <div className="h-14 flex flex-row gap-4 items-center px-4">
        <CallbackButton
          text={`End Session`}
          callback={handleLeaveQueueSession}
          className="bg-red-800 glassmorphism !bg-opacity-75 hover:!bg-opacity-90 transition-colors"
        />
      </div>
      <div className="w-full h-full grid grid-cols-2 grid-rows-1 items-center">
        <div className="h-full max-h-[70vh] col-span-1 p-4 flex items-center justify-center">
          <CurrentlyPlaying />
        </div>
        <div className="h-3/5 col-span-1 flex flex-col gap-8">
          <div className="w-full h-1/2 flex items-center justify-end">
            <SongCarousel header="Queued" songs={queued} />
          </div>
          <div className="w-full h-1/2 flex items-center justify-end">
            <SongCarousel
              header="Suggested"
              songs={suggested}
              interactive={{ onApprove: handleApprove, onReject: handleReject }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const MemberSession = () => {
  const { handleLeaveQueueSession } = useSessionManagement()
  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <div className="h-14 w-full flex flex-row gap-4 items-center px-4">
        <CallbackButton
          text={`Leave Session`}
          callback={handleLeaveQueueSession}
          className="bg-red-800 glassmorphism !bg-opacity-75 hover:!bg-opacity-90 transition-colors"
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <Suspense fallback={<div className="text-4xl">Loading..</div>}>
          <CurrentlyPlaying />
        </Suspense>
      </div>
      <div className="w-full h-full flex flex-col items-center border-2 border-pink-700">
        <Suspense>
          <div className="w-full h-full border-2 border-teal-700">
            <Search />
          </div>
        </Suspense>
      </div>
    </div>
  )
}

export default SharedSession
