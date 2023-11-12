"use client"

import { FC, use, useEffect, useRef, useState } from "react"
import { HiOutlineDotsVertical } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { Song } from "@prisma/client"
import { motion } from "framer-motion"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

import { useCurrentlyPlaying } from "@/app/hooks/useCurrentlyPlaying"
import { useSessionManagement } from "@/app/hooks/useSessionManagement"
import { Context, Status } from "@/lib/validators/context"
import { setCurrentlyPlaying } from "@/redux/reducers/currentlyPlaying"

import { Progress } from "./ui/progress"
import ScrollingText from "./scrollingText"

interface playerProps {}

const Player: FC<playerProps> = ({}) => {
  const { currentlyPlaying, progress, imageURL } = useCurrentlyPlaying()
  const status = useSelector((state: Context) => state.status)
  const path = usePathname()

  const containerRef = useRef(null)

  useSessionManagement()

  // If hosting, show should be set to true,
  // If part of a queue, show should be set to true,
  // If no queue connected in any way, show should be set to false

  // Could use a reducer for this logic with context managed at a global level
  // so that a button can be created in a page to start a queue or connect to one

  return (
    <div
      className={`h-16 w-[270px] fixed top-4 right-4 ${
        currentlyPlaying?.song ? "flex" : "hidden"
      }`}
    >
      <motion.div
        className="absolute left-0 top-0 w-16 h-16 glassmorphism-3 rounded-s overflow-hidden"
        initial={{ x: 0, y: 0, rotate: 0, scale: 1, zIndex: 0 }}
        whileHover={{ x: -20, y: 10, rotate: -24, scale: 1.4, zIndex: 1 }}
        transition={{ duration: 0.4 }}
      >
        {imageURL ? (
          <Image
            src={imageURL}
            width={64}
            height={64}
            alt={`${currentlyPlaying?.song?.name} album art`}
          />
        ) : (
          <div className="h-16 w-16 bg-gradient-to-tr from-teal-900 to-teal-500 glassmorphism" />
        )}
      </motion.div>
      <motion.div
        className="absolute w-[192px] h-16 px-4 py-[6px] glassmorphism-3 flex flex-col justify-between"
        initial={{
          x: 64,
          y: 0,
          rotate: 0,
          zIndex: 0,
          scale: 1,
          borderRadius: 0,
        }}
        whileHover={{
          x: 50,
          y: -10,
          rotate: 10,
          zIndex: 1,
          scale: 1.2,
          borderRadius: 8,
        }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="h-auto flex justify-center flex-col overflow-hidden"
          ref={containerRef}
        >
          {currentlyPlaying?.song ? (
            <>
              <ScrollingText
                text={currentlyPlaying.song.name}
                containerRef={containerRef}
                className="leading-tight"
              />
              <ScrollingText
                text={currentlyPlaying.song.artists
                  .map((artist) => artist.name)
                  .join(", ")}
                containerRef={containerRef}
                className="text-xs text-secondary leading-tight"
              />
            </>
          ) : (
            <>
              <div className="h-[1em] my-[.125em] w-[34%] !bg-[#27282C] glassmorphism rounded" />
              <div className="h-[.75em] my-[.125em] w-[67%] !bg-[#494A4E] glassmorphism rounded" />
            </>
          )}
        </div>
        <Progress value={progress.percentage} />
      </motion.div>
      <motion.div
        className="absolute right-0 top-0 w-[20px] h-16 flex items-center rounded-e glassmorphism glassmorphism-3"
        initial={{
          x: 0,
          y: 0,
          rotate: 0,
          zIndex: 0,
          scale: 1,
          borderRadius: 0,
        }}
        whileHover={{
          x: 14,
          y: -7,
          rotate: 12,
          zIndex: 1,
          scale: 1.2,
          borderRadius: 8,
        }}
        transition={{ duration: 0.4 }}
      >
        <HiOutlineDotsVertical size={30} />
      </motion.div>
    </div>
  )
}

export default function PlayerWrapper({ ...props }) {
  const path = usePathname()

  if (!path.startsWith("/player")) return <Player />
}
