"use client"

import { FC, MutableRefObject, useCallback, useState } from "react"
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io"
import { AnimatePresence, motion } from "framer-motion"

import { likeSong, unlikeSong } from "@/utilities/spotifyAPI"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface LikeButtonProps {
  songId: string
  songName: string
}

const LikeButton: FC<LikeButtonProps> = ({ songId, songName }) => {
  const [liked, setLiked] = useState(false)

  const handleLike = useCallback(() => {
    setLiked(true)
    likeSong(songId)
  }, [songId])

  const handleUnlike = useCallback(() => {
    setLiked(false)
    unlikeSong(songId)
  }, [songId])

  return (
    <div className="relative w-8 max-w-full min-h-[30px] h-full">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AnimatePresence>
              {liked ? (
                <motion.button
                  key={`liked-${songName}`}
                  onClick={handleUnlike}
                  animate={{
                    scale: [0.2, 1.4, 1],
                    opacity: [0.4, 1.4, 1],
                    translate: ["-50% -50%"],
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                  className="z-20 absolute top-1/2 left-1/2"
                >
                  <IoIosHeart size={24} className="text-red-500" />
                </motion.button>
              ) : (
                <motion.button
                  key={`unliked-${songName}`}
                  onClick={handleLike}
                  className="z-10 absolute top-1/2 left-1/2"
                  animate={{
                    scale: 1,
                    opacity: 1,
                    translate: ["-50% -50%"],
                  }}
                  exit={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <IoIosHeartEmpty size={24} />
                </motion.button>
              )}
            </AnimatePresence>
          </TooltipTrigger>
          <TooltipContent sideOffset={10} className="glassmorphism-tertiary">
            <p>
              {`${liked ? "Remove" : "Add"} ${songName} to your Spotify library`}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default LikeButton
