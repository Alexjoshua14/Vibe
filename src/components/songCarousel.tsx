'use client'

import { FC, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react"

import { postSampleData } from "@/data/songs"

import SongCard from "./cards/songCard"
import CarouselIndicator from "./carouselIndicator"

interface SongCarouselProps {
  header?: string
  songs: MutableRefObject<{
    name: string
    artists: string
    id: string
    image: {
      url: string
      alt: string
    }
  }[]>
  interactive?: {
    onApprove: (id: string, name: string) => void
    onReject: (id: string, name: string) => void
  }
}

const SongCarousel: FC<SongCarouselProps> = ({
  header,
  songs,
  interactive,
}) => {

  const indexInFocus = useRef(0)
  const items = useRef(songs.current.map(song => song.name))

  const goTo = useCallback((index: number) => {
    const prev = indexInFocus.current
    indexInFocus.current = index
    if (index < 0 || index >= songs.current.length) {
      console.warn(`Index ${index} is out of range`)
      return
    }

    // scroll carousel track to selected song
    const songCard = document.querySelector(`[id="${songs.current[index].id}"]`)
    if (songCard) {
      songCard.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start'
      })
    } else {
      console.warn("Song card not found..")
      indexInFocus.current = prev
    }

  }, [songs])

  useEffect(() => {
    items.current = songs.current.map(song => song.name)
  }, [songs])

  return (
    <div className="w-full h-fit ps-4 py-2">
      {header && (
        <div className="flex items-center whitespace-nowrap gap-2">
          <h2 className="font-extralight text-2xl">{header}</h2>
          <p className="text-secondary text-xs">{`[${songs.current.length}]`}</p>
        </div>
      )}
      <div className="w-full h-[156px] relative ps-4 py-2 carousel-container">
        <div className="relative w-full h-fit flex items-center overflow-x-scroll overflow-y-visible no-scrollbar">
          <div
            role="carousel-track"
            className="w-fit min-w-full h-fit grid grid-rows-1 grid-flow-col gap-8"
          >
            {songs.current.map((song) => (
              <SongCard
                key={song.id}
                id={song.id}
                songName={song.name}
                image={song.image}
                artists={song.artists}
                interactive={
                  interactive && {
                    onApprove: () => interactive.onApprove(song.id, song.name),
                    onReject: () => interactive.onReject(song.id, song.name),
                  }
                }
              />
            ))}
          </div>
        </div>
      </div>
      <CarouselIndicator items={songs} indexInFocus={indexInFocus} setIndexInFocus={goTo} keybase={`${header}`} />
    </div>
  )
}

export default SongCarousel
