'use client'

import React, { useRef, useEffect, useState } from 'react';

import Image from 'next/image';
import { motion } from 'framer-motion';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BsFillExplicitFill } from 'react-icons/bs';

import { msToTime, progressToPercentage } from '@/utilities/helper';

import { SpotifyItem, SongInformationVariant } from '../types/spotifyTypes';
import { Modal } from '@mui/material';
import { PostData } from '@/types';


/**
 * Displays text in confined to it's container 
 * and scrolls it if it overflows
 * 
 * @param text string to be displayed
 * @param containerRef reference to the container element
 */
const ScrollingText = ({ text, containerRef }: { text: string, containerRef: React.RefObject<HTMLDivElement> }) => {
  const [translation, setTranslation] = useState<number>(0);
  const [duration, setDuration] = useState<number>(1);

  useEffect(() => {
    const handleResize = () => {
      const containerWidth = containerRef.current?.offsetWidth;
      const textWidth = containerRef.current?.scrollWidth;
      if (containerWidth && textWidth) {
        const overflow = textWidth > containerWidth;

        if (overflow) {
          let distance = (textWidth - containerWidth) + 20;
          if (distance < 0) { distance *= -1 } //Ensure distance is always positive
          let duration = (distance * .03);
          if (duration < 1.5) duration = 1.5;

          setDuration(duration);
          setTranslation(-distance);
        } else {
          setTranslation(0);
        }
      }
    }
    handleResize();
    // window.addEventListener('resize', handleResize);
  }, [text, containerRef])

  return (
    <motion.p
      whileInView={{ x: [0, translation, 0] }}
      viewport={{ once: true }}
      transition={{ ease: "linear", delay: 2, duration: duration, times: [0, .7, 1], repeat: Infinity, repeatDelay: 4 }}
      className="max-w-full whitespace-nowrap"
    >
      {text}
    </motion.p>
  )
}

/**
 * Returns a SongInformation component that displays:
 * - The name of the song (scrolling if it overflows)
 * - If the song is explicit
 * - The type of the song
 * - The artists of the song (scrolling if it overflows)
 * 
 * @param item SpotifyItem to display information for
 * @param variant The variant of the SongInformation component
 */
const SongInformation = ({ item, variant }: { item: SpotifyItem, variant?: SongInformationVariant }) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const artistRef = useRef<HTMLDivElement>(null);

  const artists = item.artists.map(artist => artist.name).join(", ")

  return (
    <div className={`flex flex-col w-full justify-between ${variant != "modal" && "items-start"} ${variant == "modal" && "items-center"}`}>
      <div
        ref={titleRef}
        className={`
        ${variant == "secondary" || variant == undefined && "text-md"}
        ${variant == "main" || variant == "modal" && "text-xl"} 
        whitespace-nowrap overflow-x-hidden max-w-full`}
      >
        <ScrollingText text={item.name} containerRef={titleRef} />
      </div>
      <div
        className={`
          flex gap-2 text-gray-300 items-center
          max-w-[90%] ${variant == "modal" && "max-w-[80%]"}
          text-xs`}
      >
        {item.explicit &&
          <span className="w-fit h-fit">
            <BsFillExplicitFill />
          </span>
        }
        <div className={`flex gap-1 overflow-hidden`}>
          {variant != "main" && (
            <>
              <p>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </p>
              <p>
                •
              </p>
            </>
          )}
          <div ref={artistRef} className={`overflow-hidden whitespace-nowrap max-w-full`}>
            <ScrollingText text={artists} containerRef={artistRef} />
          </div>
        </div>
      </div>
    </div >
  )
}

/**
 * Creates a feature card for a song with a progress bar
 * 
 * @param song The song to create a card for
 * @param progress The progress of the song 
 */
export const SongCard = ({ song, progress_ms }: { song: SpotifyItem, progress_ms?: number }) => {
  return (
    <Card sx={{ display: 'flex' }}
      className={`rounded-lg w-[300px] sm:w-[400px] overflow-hidden h-[400px] sm:h-[140px]
                 bg-gradient-to-tr from-gray-800 to-gray-600 bg-opacity-40 backdrop-blur-lg text-white`}>
      <Box className="flex flex-col sm:flex-row justify-center items-center w-full overflow-hidden">
        <CardMedia
          component="img"
          className="w-[300px] h-[300px] sm:w-[140px] sm:h-[140px] aspect-square"
          image={song.album.images[0].url}
          alt={song.album.name}
        />
        <CardContent className="flex flex-col justify-between w-full sm:pe-4 overflow-hidden">
          <SongInformation item={song} variant={"main"} />
          {progress_ms &&
            <div className="w-full">
              <LinearProgress variant="determinate" value={progressToPercentage(progress_ms, song.duration_ms)} />
              <Typography component="div" variant="subtitle2">
                {msToTime(progress_ms)} / {msToTime(song.duration_ms)}
              </Typography>
            </div>
          }
        </CardContent>
      </Box>
    </Card >
  )
}

/**
 * Creates a simple card to display a Spotify Item's information
 * 
 * @param item The item to create a search card for
 */
export const SearchResult = ({ item }: { item: SpotifyItem }) => {
  return (
    <div
      className={`rounded-lg w-[300px] sm:w-[400px] pe-4 
                  bg-gray-600 bg-opacity-20 backdrop-blur-xl 
                  text-white overflow-hidden cursor-pointer`}
    >
      <div className="flex w-full">
        <div className="flex justify-center items-center p-2">
          <Image
            src={item.album.images[0].url}
            height={60}
            width={60}
            alt={item.album.name}
          />
        </div>
        <div className="flex flex-col w-full p-4 max-w-[200px] sm:max-w-[300px]">
          <SongInformation item={item} />
        </div>
      </div>
    </div>
  )
}

export const Post = ({ post }: { post: PostData }) => {
  return (
    <div className="flex flex-row min-w-[300px] w-full max-w-[360px] h-[220px] border-2 border-teal-500">
      <div className="flex flex-col w-1/3 h-full border-2 border-yellow-500">
        <div className="w-full aspect-square rounded-full flex justify-center items-center border-2 border-orange-500">Image</div>
        <div className="flex-1 flex flex-col items-center justify-center whitespace-nowrap overflow-hidden">
          <span>{post.item.name}</span>
          <span>{post.item.artists[0].name}</span>
          <span>{post.item.album.name}</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col py-4 px-2 border-2 border-pink-500">
        <div className="flex gap-2 min-h-[30px]">
          <div className="w-[50px] aspect-square rounded-full flex justify-center items-center border-2 border-orange-500">
            <span>IMG</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg">
              {post.user.name}
            </span>
            <span className="text-xs text-gray-300">
              {post.createdAt}
            </span>
          </div>
        </div>
        <div className="max-w-[200px] overflow-hidden px-2">
          <span className="text-gray-500">________________________________________________</span>
        </div>
        <div className="flex flex-col flex-1 justify-center gap-1">
          <div className="text-lg">
            {post.title}
          </div>
          <div className="text-sm">
            {post.body}
          </div>
        </div>
      </div>
    </div>
  )
}


/**
 * Modal that displays information about a Spotify Item
 * and allows the user to add it to the queue
 * 
 * @param item SpotifyItem to display information for
 * @param open Whether the modal is open or not
 * @param addToQueue Function to add the item to the queue
 * @param cancelAddToQueue Function to cancel adding the item to the queue
 * @returns 
 */
export const AddToQueueModal = ({ item, open, addToQueue, cancelAddToQueue }:
  {
    item: SpotifyItem,
    open: boolean,
    addToQueue: () => any,
    cancelAddToQueue: () => void,
  }) => {
  return (
    <Modal
      open={open}
      onClose={cancelAddToQueue}
    >
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] 
                      w-[90%] h-1/2 sm:w-[500px] sm:h-96 rounded-lg
                      flex flex-col items-center justify-center
                      backdrop-filter backdrop-blur-lg"
      >
        <div className="flex flex-col justify-center items-center w-fit max-w-full gap-4">
          <div className="rounded-lg overflow-hidden">
            <Image
              src={item?.album.images[0].url ?? ""}
              height={140}
              width={140}
              alt={item?.album.name ?? ""}
            />
          </div>
          <div className="max-w-[80%]">
            <SongInformation item={item} variant={"modal"} />
          </div>
        </div>
        <div className="p-4 flex items-center justify-center gap-2 sm:gap-4">
          <button onClick={addToQueue()} className="px-3 py-1 bg-green-500 bg-opacity-60 rounded-lg">
            Add to Queue
          </button>
          <button onClick={cancelAddToQueue} className="px-3 py-1 bg-red-500 bg-opacity-50 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}