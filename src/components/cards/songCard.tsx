import { FC, HTMLAttributes } from 'react'
import { IconType } from 'react-icons'
import { IoMdCheckmark, IoMdClose } from 'react-icons/io'
import Image from 'next/image'

import { cn } from '@/lib/utils'

interface SongCardProps extends HTMLAttributes<HTMLDivElement> {
  image: {
    url: string,
    alt: string,
    quality?: number
  },
  songName: string,
  artists: string,
  interactive?: {
    onApprove: () => void,
    onReject: () => void,
  }
}

interface SongCardButtonProps extends HTMLAttributes<HTMLButtonElement> {
  text?: string
  icon?: {
    icon: IconType,
    size: number
  }
  callback: () => void
}

const SongCardButton: FC<SongCardButtonProps> = ({ text, icon, className, callback }) => {

  if (text)
    return (
      <button
        className={cn("p-2 rounded-full glassmorphism-tertiary-interactive hover:scale-110 transition-all", className)}
        onClick={callback}
      >
        <p>
          {text}
        </p>
      </button>
    )
  else if (icon)
    return (
      <button
        className={cn("p-2 rounded-full glassmorphism-tertiary-interactive hover:scale-110 transition-all", className)}
        onClick={callback}
      >
        <icon.icon size={icon.size} />
      </button>
    )
}

const SongCard: FC<SongCardProps> = ({ image, songName, artists, className, interactive, ...props }) => {
  return (
    <div
      className={cn("relative flex items-center gap-4 h-[140px] aspect-[5/2]", className)}
      {...props}
    >
      <div className="relative h-full aspect-square rounded overflow-clip glassmorphism-primary">
        <Image
          src={image.url}
          alt={image.alt}
          height={140}
          width={140}
          quality={image.quality ?? 75}
          className='object-contain'
        />
      </div>
      <div className="absolute flex flex-col w-2/3 px-4 py-2 gap-2 left-24 glassmorphism-tertiary rounded">
        <div>
          <p className="text-primary text-lg h-[1.75rem]">
            {songName}
          </p>
          <p className="text-tertiary text-sm h-[1.5rem] font-light">
            {artists}
          </p>
        </div>
      </div>
      {interactive &&
        <div className="absolute right-8 bottom-4 w-24 h-10 flex justify-around items-center">
          <SongCardButton icon={{ icon: IoMdCheckmark, size: 20 }} callback={interactive.onApprove} className="bg-teal-200" />
          <SongCardButton icon={{ icon: IoMdClose, size: 20 }} callback={interactive.onReject} className="bg-red-300" />
        </div>
      }
    </div>
  )
}

export default SongCard