"use client"

import React, { FC, HTMLAttributes, useRef } from "react"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Context } from "@/lib/validators/context"
import { msToTime } from "@/utilities/helper"

import LikeButton from "../buttons/LikeButton"
import ScrollingText from "../scrollingText"
import { Progress } from "../ui/progress"
import { Skeleton } from "../ui/skeleton"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  image: {
    url: string
    alt: string
    quality?: number
  }
  songName: string
  id: string
  artists: string
  duration: number
  progress: {
    percentage: number
    time: number
  }
}

// POSSIBLE TODO: Pull the dominant color from image and use it for background and/or progress indicator
export const Card: FC<CardProps> = ({
  image,
  songName,
  id,
  artists,
  duration,
  progress,
  className,
  ...props
}) => {
  const songNameRef = useRef(null)
  const artistNameRef = useRef(null)
  const { searching } = useSelector((state: Context) => state.search)

  return (
    <motion.div
      animate={{
        flexDirection: searching ? "row" : "column",
        textAlign: searching ? "left" : "center",
      }}
      // transition={{ duration: 1, ease: easeInOut }}
      className={cn(
        `flex flex-col items-center justify-center gap-2 sm:gap-4 
            max-h-full min-w-[180px] w-full max-w-[400px] p-2
            ${searching
          ? "h-[100px] aspect-[5/2]"
          : "min-h-[200px] aspect-[2/3]"
        }`,
        className,
      )}
    >
      <motion.div
        animate={{
          height: searching ? "100%" : "66.667%",
          width: searching ? "100%" : "auto",
        }}
        className="relative max-w-full max-h-full aspect-square rounded overflow-clip glassmorphism-primary"
      >
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="33vw"
            quality={image.quality ?? 75}
            className="object-cover"
            priority
            id="currently-playing-image"
          />
        ) : (
          <div className="w-full h-full bg-teal-700 glassmorphism rounded" />
        )}
      </motion.div>

      <div
        className={`flex flex-col w-full gap-1 sm:gap-2 ${searching ? "px-2" : "px-2 sm:px-4"
          }`}
      >
        <div className={`max-w-full ${searching ? "px-0" : "px-4"}`}>
          <div ref={songNameRef} className="max-w-full overflow-hidden">
            <ScrollingText
              text={songName}
              className={`text-primary ${searching ? "text-base" : "text-lg sm:text-xl"
                } leading-tight`}
            />
          </div>
          <div ref={artistNameRef} className="max-w-full overflow-hidden">
            <ScrollingText
              text={artists}
              className={`text-secondary ${searching ? "text-sm" : "text-sm sm:text-lg"
                } font-light leading-tight`}
            />
          </div>
        </div>
        <div
          className={`w-full grid grid-rows-1 ${searching ? "grid-cols-[3fr_1fr]" : "grid-cols-[2fr_4fr_1fr_1fr]"
            } items-center justify-between gap-2 text-tertiary text-xs`}
        >
          {!searching && <p className="text-end">{msToTime(progress.time)}</p>}
          <Progress value={progress.percentage} />
          {!searching && <p>{msToTime(duration)}</p>}
          <LikeButton songId={id} songName={songName} />
        </div>
      </div>
    </motion.div>
  )
}

export const SkeletonCard = () => (
  <div
    className={`flex flex-col items-center justify-center gap-2 sm:gap-4 p-2
        max-h-full min-w-[180px] w-full max-w-[400px] min-h-[200px] aspect-[2/3]`}
  >
    <Skeleton className="max-w-full max-h-full aspect-square rounded h-2/3" />
    <div className="flex flex-col items-center w-full gap-2 px-4">
      <div className="flex flex-col w-full items-center px-4 gap-1">
        <Skeleton className="w-3/5 h-5 rounded" />
        <Skeleton className="w-full h-4 rounded" />
      </div>
      <Skeleton className="w-full h-3 rounded-full" />
    </div>
  </div>
)
