import { FC, HTMLAttributes } from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { msToTime } from '@/utilities/helper'

import { Progress } from '../ui/progress'

interface SongCardProps extends HTMLAttributes<HTMLDivElement> {
  image: {
    url: string,
    alt: string,
    quality?: number
  },
  songName: string,
  artists: string,
}

const SongCard: FC<SongCardProps> = ({ image, songName, artists, className, ...props }) => {
  return (
    <div
      className={cn("flex items-center gap-4 h-[140px] aspect-[5/2] bg-tertiary glassmorphism-2 rounded", className)}
      {...props}
    >
      <div className="relative h-full aspect-square rounded overflow-clip glassmorphism">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          quality={image.quality ?? 75}
          className='object-contain'
        />
      </div>
      <div className="flex flex-col w-full gap-2">
        <div>
          <p className="text-primary text-lg h-[1.75rem]">
            {songName}
          </p>
          <p className="text-tertiary text-sm h-[1.5rem] font-light">
            {artists}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SongCard