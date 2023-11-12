import { FC } from "react"

import { postSampleData } from "@/data/songs"

import SongCard from "./cards/songCard"

interface SongCarouselProps {
  header?: string
  songs: {
    name: string
    artists: string
    id: string
    image: {
      url: string
      alt: string
    }
  }[]
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
  return (
    <div className="w-full h-fit ps-4 py-2">
      {header && (
        <div className="flex items-center whitespace-nowrap gap-2">
          <h2 className="font-extralight text-2xl">{header}</h2>
          <p className="text-secondary text-xs">{`[${songs.length}]`}</p>
        </div>
      )}
      <div className="w-full relative ps-4 py-2 carousel-container">
        <div className="relative w-full h-fit flex items-center overflow-x-scroll overflow-y-visible no-scrollbar">
          <div
            role="carousel-track"
            className="w-fit min-w-full h-fit grid grid-rows-1 grid-flow-col gap-8"
          >
            {songs.map((song) => (
              <SongCard
                key={song.id}
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
    </div>
  )
}

export default SongCarousel
