import React, { FC, HTMLAttributes } from 'react'
import { Artist, Song } from '@prisma/client';
import Image from "next/image";

import { cn } from '@/lib/utils';
import { msToTime } from '@/utilities/helper';

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
  return (
    <div
      className={cn("flex flex-col items-center gap-4 min-h-[240px] h-2/3 max-h-[600px]  aspect-[2/3] text-center", className)}
    >
      <div className="relative h-2/3 aspect-square rounded overflow-hidden glassmorphism">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          quality={image.quality ?? 75}
        />
      </div>
      <div className="flex flex-col w-full gap-2">
        <div>
          <p className="text-primary text-xl h-[1.75rem]">
            {songName}
          </p>
          <p className="text-secondary text-lg h-[1.75rem]">
            {artists}
          </p>
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