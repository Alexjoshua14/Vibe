import React, { FC, HTMLAttributes, useRef } from 'react'
import { Artist, Song } from '@prisma/client';
import Image from "next/image";

import { cn } from '@/lib/utils';
import { msToTime } from '@/utilities/helper';

import ScrollingText from '../scrollingText';
import { Progress } from '../ui/progress';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  image: {
    url: string,
    alt: string,
    quality?: number
  },
  songName: string,
  artists: string,
  duration: number,
  progress: {
    percentage: number,
    time: number
  }
}


export const Card: FC<CardProps> = ({ image, songName, artists, duration, progress, className, ...props }) => {
  const songNameRef = useRef(null)
  const artistNameRef = useRef(null)

  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-4 min-h-[270px] max-h-[600px] min-w-[180px] w-full max-w-[400px] aspect-[2/3] text-center", className)}
    >
      <div className="relative max-h-2/3 w-full aspect-square rounded overflow-clip glassmorphism">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          quality={image.quality ?? 75}
          className="object-contain aspect-square"
        />
      </div>
      <div className="flex flex-col w-full gap-2 px-4">
        <div className="max-w-full px-4">
          <div ref={songNameRef} className="max-w-full overflow-hidden">
            <ScrollingText containerRef={songNameRef} text={songName} className="text-primary text-xl leading-tight" />
          </div>
          <div ref={artistNameRef} className="max-w-full overflow-hidden">
            <ScrollingText containerRef={artistNameRef} text={artists} className="text-secondary text-lg leading-tight" />
          </div>
          {/* <p className="text-primary text-xl h-[1.75rem]">
            {songName}
          </p>
          <p className="text-secondary text-lg h-[1.75rem]">
            {artists}
          </p> */}
        </div>
        <div className="w-full flex items-center justify-between gap-2 text-tertiary text-xs">
          <p>
            {msToTime(progress.time)}
          </p>
          <Progress value={progress.percentage} />
          <p>
            {msToTime(duration)}
          </p>
        </div>
      </div>
    </div>
  )
}