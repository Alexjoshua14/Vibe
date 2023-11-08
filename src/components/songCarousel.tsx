import { FC } from 'react'

import { postSampleData } from '@/data/songs'

import SongCard from './cards/songCard'

interface SongCarouselProps {
  header?: string
}

const SongCarousel: FC<SongCarouselProps> = ({ header }) => {
  return (
    <div className='w-full h-fit ps-4 py-2'>
      {header &&
        <h2 className='font-extralight text-2xl'>
          {header}
        </h2>
      }
      <div className="w-full relative ps-4 py-2 carousel-container">
        <div className="relative w-full h-fit flex items-center overflow-x-scroll overflow-y-visible no-scrollbar">
          <div role='carousel-track' className="w-fit min-w-full h-fit grid grid-rows-1 grid-flow-col gap-8">
            <SongCard songName={postSampleData.item.name} image={{ url: postSampleData.item.album.images[0].url, alt: "" }} artists={postSampleData.item.artists.map((artist) => artist.name).join(", ")} />
            <SongCard songName={postSampleData.item.name} image={{ url: postSampleData.item.album.images[0].url, alt: "" }} artists={postSampleData.item.artists.map((artist) => artist.name).join(", ")} />
            <SongCard songName={postSampleData.item.name} image={{ url: postSampleData.item.album.images[0].url, alt: "" }} artists={postSampleData.item.artists.map((artist) => artist.name).join(", ")} />
            <SongCard songName={postSampleData.item.name} image={{ url: postSampleData.item.album.images[0].url, alt: "" }} artists={postSampleData.item.artists.map((artist) => artist.name).join(", ")} />
            <SongCard songName={postSampleData.item.name} image={{ url: postSampleData.item.album.images[0].url, alt: "" }} artists={postSampleData.item.artists.map((artist) => artist.name).join(", ")} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SongCarousel