"use client"

import { FC, useRef } from "react"
import { HiOutlineDotsVertical } from "react-icons/hi"
import { useSelector } from "react-redux"
import Image from "next/image"

import { useCurrentlyPlaying } from "@/app/hooks/useCurrentlyPlaying"
import { Progress } from "@/components/ui/progress"
import { Context } from "@/lib/validators/context"
import { msToTime } from "@/utilities/helper"

import { Card, SkeletonCard } from "./cards/currentlyPlayingCard"
import ScrollingText from "./scrollingText"

interface currentlyPlayingProps { }

const CurrentlyPlaying: FC<currentlyPlayingProps> = ({ }) => {
  const status = useSelector((state: Context) => state.status)

  const { currentlyPlaying, progress, imageURL, loading } =
    useCurrentlyPlaying()

  if (status === "IDLE") {
    return (
      <div>
        <h1>{`You don't appear to be part of a session..`}</h1>
      </div>
    )
  }

  if (loading) {
    return <SkeletonCard />
  }

  if (currentlyPlaying?.song) {
    return (
      <Card
        image={{ url: imageURL, alt: "", quality: 100 }}
        progress={progress}
        songName={currentlyPlaying.song.name}
        id={currentlyPlaying.song.id}
        duration={currentlyPlaying.song.duration_ms}
        artists={currentlyPlaying.song.artists
          .map((artist) => artist.name)
          .join(", ")}
      />
    )
  }
}

export default CurrentlyPlaying
