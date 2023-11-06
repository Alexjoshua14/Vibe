"use client"

import { FC, useRef } from "react"
import { HiOutlineDotsVertical } from "react-icons/hi"
import { useSelector } from "react-redux"
import Image from "next/image"

import { useCurrentlyPlaying } from "@/app/hooks/useCurrentlyPlaying"
import { Progress } from "@/components/ui/progress"
import { Context } from "@/lib/validators/context"

import ScrollingText from "./scrollingText"
import { SongCard } from "./songCard"

interface currentlyPlayingProps { }

const CurrentlyPlaying: FC<currentlyPlayingProps> = ({ }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const status = useSelector((state: Context) => state.status)
  // const currentlyPlaying = useSelector((state: Context) => state.currentlyPlaying)
  // const progress = useSelector((state: Context) => state.progress)

  const { currentlyPlaying, progress, imageURL } = useCurrentlyPlaying()

  if (status === 'IDLE') {
    return (
      <div>
        <h1>{`You don't appear to be part of a session..`}</h1>
      </div>
    )
  }

  if (/*currentlyPlaying?.song*/true) {
    return (
      <div className={`h-full min-w-[300px] w-3/4 max-w-[700px] flex flex-col`}>
        <div
          className="glassmorphism-3 overflow-hidden h-[300px] w-[300px] relative rounded-t"
        >
          {imageURL ?
            <Image src={imageURL} width={300} height={300} alt={`${currentlyPlaying?.song?.name} album art`} />
            : <div className="h-full w-full bg-gradient-to-tr from-teal-900 to-teal-500 glassmorphism" />
          }
        </div>
        <div
          className="flex-1 w-full px-4 py-2 glassmorphism-3 flex flex-col justify-between rounded-b"
        >
          <div className="flex justify-center items-center flex-col text-center overflow-hidden" ref={containerRef}>
            {currentlyPlaying?.song ? (
              <>
                <ScrollingText text={currentlyPlaying.song.name} containerRef={containerRef} className="text-3xl leading-tight" />
                <ScrollingText text={currentlyPlaying.song.artists.map((artist) => artist.name).join(", ")} containerRef={containerRef} className="text-xl text-secondary leading-tight" />
              </>
            ) : (
              <>
                <div className="h-[1.875em] my-[.25em] w-[34%] !bg-[#27282C] glassmorphism rounded" />
                <div className="h-[1.25em] my-[.25em] w-[67%] !bg-[#494A4E] glassmorphism rounded" />
              </>
            )}
          </div>
          <Progress
            value={progress.percentage}
          />
        </div>
      </div>
    )
  } else if (currentlyPlaying == undefined) {
    return <div className="text-pink-700">Loading stuff!</div>
  } else {
    return (
      <div className="flex h-full w-full justify-center items-center text-center text-teal-700">
        <h1>Start listening to something..</h1>
      </div>
    )
  }
}

export default CurrentlyPlaying
