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
import { Divider, Modal } from '@mui/material';
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
        whitespace-nowrap overflow-x-hidden max-w-full text-primary
        `}
      >
        <ScrollingText text={item.name} containerRef={titleRef} />
      </div>
      <div
        className={`
          flex gap-2 text-secondary items-center
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
      className={`rounded w-[300px] sm:w-[400px] overflow-hidden h-[400px] sm:h-[140px]
                 glassmorphism-white glassmorphism-2`}>
      <Box className="flex flex-col sm:flex-row center w-full overflow-hidden">
        <CardMedia
          component="img"
          className="w-[300px] h-[300px] sm:w-[140px] sm:h-[140px] aspect-square"
          image={song.album.images[0].url}
          alt={song.album.name}
        />
        <CardContent className="flex flex-col justify-between w-full sm:pe-4 overflow-hidden">
          <SongInformation item={song} variant={"main"} />
          {progress_ms != null &&
            <div role="progress" className="w-full">
              <LinearProgress role="progressbar" variant="determinate" value={progressToPercentage(progress_ms, song.duration_ms)} />
              <Typography component="div" variant="subtitle2" className="text-[.65rem] text-tertiary">
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
export const SearchResult = ({ item, props }: { item: SpotifyItem, [key: string]: any }) => {
  return (
    <div
      className={`rounded w-[300px] sm:w-[400px] pe-4 flex h-fit`}
      {...props}
    >
      <div className="flex center">
        <Image
          src={item.album.images[0].url}
          height={75}
          width={75}
          alt={item.album.name}
        />
      </div>
      <div className="flex flex-col w-full p-4 max-w-[200px] sm:max-w-[300px]">
        <SongInformation item={item} />
      </div>
    </div>
  )
}

const PostImage = ({ imageUrl, altText, ...props }: { imageUrl: string, altText: string, [key: string]: any }) => {
  return (
    <div className="relative h-1/2 aspect-square flex center rounded-br overflow-hidden">
      <Image
        src={imageUrl}
        alt={altText}
        // width={250}
        // height={250}
        fill={true}
        {...props}
      />
    </div>
  )
}

const ProfileImage = ({ imageUrl, altText, ...props }: { imageUrl: string, altText: string, [key: string]: any }) => {
  return (
    <div className="aspect-square rounded-full flex center">
      <Image
        src={imageUrl}
        alt={altText}
        width={50}
        height={50}
        {...props}
      />
    </div>
  )
}


export const Post = ({ post }: { post: PostData }) => {

  return (
    <div
      className=" grid grid-row-1 grid-cols-[1fr,3fr]
                  min-w-[250px] min-h-[200px] w-[80%] h-[200px]
                  sm:w-[60%] sm:min-h-[100px] sm:max-w-[500px] sm:max-h-[250px] 
                  rounded overflow-hidden
                  bg-gradient-to-tr from-gray-950 to-gray-700 glassmorphism
                  ">

      <div className="flex flex-col pb-2 pe-1 min-w-fit">
        <PostImage
          imageUrl={post.item.album.images[0].url}
          altText={post.item.album.name}
        />

        <div className="flex-1 flex flex-col center whitespace-nowrap overflow-hidden py-1 sm:py-2">
          <span className="text-xs">{post.item.name}</span>
          <span className="text-xs">{post.item.artists[0].name}</span>
          <span className="text-[.65rem] text-zinc-200">{post.item.album.name}</span>
        </div>

      </div>

      <div className="grid grid-rows-[2fr, 1fr, 6fr] py-6 px-4">

        <div className="flex items-center gap-2 min-h-[30px]">
          <ProfileImage imageUrl={post.user.spotifyProfile} altText={`${post.user.name} profile picture`} className="rounded-full" />
          <div className="flex flex-col">
            <span className="text-sm sm:text-md">
              {post.user.name}
            </span>
            <span className="text-[.65rem] sm:text-xs text-zinc-300">
              {post.createdAt}
            </span>
          </div>
        </div>

        <div className="max-w-full sm:max-w-[80%] overflow-hidden px-1 sm:px-2">
          <span className="text-gray-500">________________________________________________</span>
        </div>
        <div className="flex flex-col flex-1 justify-center gap-1">
          <div className="text-md sm:text-lg">
            {post.title}
          </div>
          <div className="text-xs sm:text-sm text-zinc-100 text-ellipsis">
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
                      flex flex-col center
                      backdrop-filter backdrop-blur-lg"
      >
        <div className="flex flex-col center w-fit max-w-full gap-4">
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
        <div className="p-4 flex center gap-2 sm:gap-4">
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