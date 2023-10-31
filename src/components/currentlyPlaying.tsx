'use client'

import { FC } from 'react'

import { useCurrentlyPlaying } from '@/app/hooks/useCurrentlyPlaying'

import { SongCard } from './songCard'

interface currentlyPlayingProps {

}

const CurrentlyPlaying: FC<currentlyPlayingProps> = ({ }) => {
  const { currentlyPlaying, progress } = useCurrentlyPlaying()

  if (currentlyPlaying) {
    return (
      <SongCard
        song={currentlyPlaying.item}
        progress_ms={progress.time}
      />
    )
  } else if (currentlyPlaying == undefined) {
    return (
      <div className="text-pink-700">
        Loading stuff!
      </div>
    )
  } else {
    return (
      <div className="flex h-full w-full justify-center items-center text-center text-teal-700">
        <h1>
          Start listening to something..
        </h1>
      </div>
    )
  }
}

export default CurrentlyPlaying