import { FC, HTMLAttributes } from "react"
import { IconType } from "react-icons"
import { IoMdCheckmark, IoMdClose } from "react-icons/io"
import Image from "next/image"

import { cn } from "@/lib/utils"

import SongCardButton from "../buttons/songCardButtons"
import ImageHolder from "../Images/imageHolder"
import ScrollingText from "../scrollingText"

interface SongCardProps extends HTMLAttributes<HTMLDivElement> {
  image: {
    url: string
    alt: string
    quality?: number
  }
  songName: string
  artists: string
  interactive?: {
    onApprove: () => void
    onReject: () => void
  }
}

const SongCard: FC<SongCardProps> = ({
  image,
  songName,
  artists,
  className,
  interactive,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative flex items-center h-[90px] sm:h-[140px] aspect-[5/2]",
        className,
      )}
      {...props}
    >
      <div className="h-full aspect-square">
        <ImageHolder src={image.url} alt={image.alt} />
      </div>
      <div className="absolute flex flex-col w-2/3 h-2/3 px-4 py-2 left-[25%] glassmorphism-tertiary rounded">
        <ScrollingText text={songName} className={`text-primary text-lg`} />
        <ScrollingText
          text={artists}
          className={`text-tertiary text-sm font-light`}
        />
      </div>
      {interactive && (
        <div className="absolute right-0 sm:right-[15%] sm:bottom-0 w-10 sm:w-24 h-full sm:h-10 flex flex-col sm:flex-row justify-around items-center">
          <SongCardButton
            icon={{ icon: IoMdCheckmark, size: 20 }}
            callback={interactive.onApprove}
            className="bg-teal-200"
          />
          <SongCardButton
            icon={{ icon: IoMdClose, size: 20 }}
            callback={interactive.onReject}
            className="bg-red-300"
          />
        </div>
      )}
    </div>
  )
}

export default SongCard
